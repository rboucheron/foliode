import { ProgressBar } from "@heroui/react";

interface FormProgressProps {
    currentStep: number;
    totalSteps: number;
    progress?: number;
    getStepTitle: (step: number) => string;
}

export const FormProgress = ({
    currentStep,
    totalSteps,
    getStepTitle,
}: FormProgressProps) => {
    const progressValue = ((currentStep + 1) / totalSteps) * 100;

    return (
        <>
            <h2 className="text-xl font-bold mb-4" id="progress-header">
                {currentStep + 1}: {getStepTitle(currentStep)}
            </h2>

            <div className="flex items-center justify-between mb-6 relative">
                {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
                    <div key={step} className="flex items-center z-10">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors ${step <= currentStep + 1
                                ? "bg-primary text-primary-foreground"
                                : "bg-default-200 text-default-500"
                                }`}
                        >
                            {step}
                        </div>
                    </div>
                ))}
                <ProgressBar
                    value={progressValue}
                    aria-labelledby="progress-header"
                    className="absolute top-1/2 left-0 -translate-y-1/2 w-full z-0"
                />
            </div>
        </>
    );
};
