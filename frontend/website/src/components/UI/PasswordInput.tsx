import React, { useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { Input } from "@heroui/react";

interface PasswordInputProps {
  onChange: (password: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  label: string;
  name: string;
  id?: string;
  autoComplete?: string;
  testId?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  onChange,
  value,
  label,
  name,
  id,
  autoComplete,
  testId
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const styles = {
    inputWrapper: [
      "border-default-300",
      "data-[hover=true]:border-primary-300",
      "group-data-[focus=true]:border-primary",
      "bg-background",
    ],
    input: [
      "text-foreground",
      "placeholder:text-default-400",
    ],
    label: "text-foreground-700",
    clearButton: "text-primary",
  };

  return (
    <Input
      isRequired
      label={label}
      id={id}
      autoComplete={autoComplete}
      data-testid={testId}
      variant="bordered"
      placeholder="••••••••"
      value={value}
      onChange={(e) => onChange(e)}
      name={name}
      endContent={
        <button
          className="focus:outline-none flex items-center justify-center p-1 rounded-full hover:bg-default-100 transition-colors"
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          data-testid={testId ? `${testId}-toggle` : undefined}
        >
          {isVisible ? (
            <FaEyeSlash className="text-xl text-default-500 pointer-events-none" />
          ) : (
            <IoEyeSharp className="text-xl text-default-500 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      classNames={styles}
    />
  );
};

export default PasswordInput;
