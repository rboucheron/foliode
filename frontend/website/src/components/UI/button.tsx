import { Button } from "@heroui/react";
import Link from "next/link";

interface ButtonProps {
    text: React.ReactNode;
    style: "form" | "card" | "default"; 
    icon?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string;
    type?: "button" | "submit" | "reset";
    isDisabled?: boolean;
    subDescription?: string;
    testId?: string;
}

const Buttons: React.FC<ButtonProps> = ({
    text,
    style,
    icon,
    className,
    onClick,
    href,
    type = "button",
    isDisabled = false,
    subDescription,
    testId
}) => {
    const ButtonContent = (
        <div className="flex flex-col w-full items-center">
            <Button
                type={type}
                onPress={onClick}
                isDisabled={isDisabled}
                data-testid={testId}
                className={
                    style === "form" 
                        ? `flex w-full p-[10px] justify-center items-center gap-[12px] rounded-[8px] border-[1px] text-base border-primary bg-primary hover:bg-primary-100 text-white font-semibold shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-all duration-200 ${className}`
                        : style === "card"
                        ? `flex w-[116px] h-[37px] p-[10px] justify-center items-center gap-[10px] rounded-[30px] border border-default-400 bg-background text-foreground hover:bg-default-100 dark:hover:bg-default-200 transition-all duration-200 ${className}`
                        : `flex w-full items-center justify-center rounded-[8px] text-white font-inter text-base font-semibold leading-6 border-primary border-1 bg-primary hover:bg-primary-100 transition-all duration-200 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] ${className}`
                }
            >
                {icon && <span className="flex items-center justify-center">{icon}</span>}
                {text}
            </Button>
            {subDescription && (
                <p className="text-foreground/80 font-archivo text-base font-medium leading-normal mt-2">
                    {subDescription}
                </p>
            )}
        </div>
    );

    if (href) {
        return <Link href={href}>{ButtonContent}</Link>;
    }

    return ButtonContent;
};

export default Buttons;