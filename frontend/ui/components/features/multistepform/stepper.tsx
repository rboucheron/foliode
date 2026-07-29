"use client";

import { ReactNode, useState } from "react"
import { Card } from "@heroui/react"
import { FormProgress } from "./formprogress"
import { HerouiButton as Button } from "../../../components/ui"

type step = {
  title: string,
  children: ReactNode
}

type stepperButtons = {
  previous: {
    label: string,
  }
  next: {
    label: string,
  }
  end: {
    label: string,
  }
}

interface StepperProps {
  steps: step[]
  withFormProgress: boolean
  buttons: stepperButtons
  onStepChange?: (step: number) => void
  onStepperEnd?: () => void
}

export const Stepper = ({ steps, withFormProgress, buttons, onStepChange, onStepperEnd }: StepperProps) => {
  const totalSteps = 3;
  const [currentStep, setCurrentStep] = useState(0);

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    onStepChange && onStepChange(currentStep - 1);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    onStepChange && onStepChange(currentStep + 1);
  };

  return (
    <Card className="p-6">
      {withFormProgress && (
        <FormProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          getStepTitle={(step: number) => steps[step].title}
        />
      )}
      <div>
        {steps[currentStep].children}
        <div className="flex justify-between mt-6">
          {currentStep > 0 ? (
            <Button
              text={buttons.previous.label}
              variant="primary"
              size="md"
              onPress={handlePrevious}
              data-testid="portfolio-edit-prev-step"
              className='dayMode bg-primary text-white w-full'

            />
          ) : (<div></div>)
          }
          {currentStep < totalSteps ? (
            <Button
              text={buttons.next.label}
              variant="primary"
              size="md"
              onPress={handleNext}
              testId="portfolio-edit-next-step"
              className="dayMode bg-primary text-white"
            />

          ) : (
            <Button
              text={buttons.end.label}
              onPress={onStepperEnd}
              testId="portfolio-edit-publish"
              className="dayMode bg-primary text-white"
            />
          )}
        </div>
      </div>
    </Card>
  )

}
