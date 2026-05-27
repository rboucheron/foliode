import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import { CriteriaItem } from "./CriteriaItem";

interface PasswordStrengthCheckerProps {
  onChange: ({
    password,
    confirmPassword,
  }: {
    password: string;
    confirmPassword: string;
  }) => void;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({
  onChange,
}) => {
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const hasUpperCase = /[A-Z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
  const isAtLeast8Chars = passwordValue.length >= 8;

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    onChange({ password: passwordValue, confirmPassword });
    setConfirmPasswordValue(confirmPassword);
  };

  const handlePasswordChange = (password: string) => {
    onChange({ password, confirmPassword: confirmPasswordValue });
    setPasswordValue(password);
  };

  return (
    <>
      <PasswordInput
        value={passwordValue}
        onChange={(value) => handlePasswordChange(value.target.value)}
        label="Mot de passe"
        name="password"
        id="password"
        autoComplete="new-password"
        testId="password-input"
      />
      {hasUpperCase && hasNumber && hasSpecialChar && isAtLeast8Chars ? (
        <PasswordInput
          value={confirmPasswordValue}
          onChange={(value) => handleConfirmPasswordChange(value.target.value)}
          label="Confirmer le mot de passe"
          name="confirmpassword"
          id="password-confirm"
          autoComplete="new-password"
          testId="password-confirm-input"
        />
      ) : (
        <>
          {passwordValue === "" ? (
            ""
          ) : (
            <div 
              className="space-y-2 p-3 w-full rounded-lg bg-default-50 border border-default-200 transition-all duration-200" 
              aria-live="polite"
              data-testid="password-criteria"
            >
              <p className="text-xs text-foreground-500 font-semibold mb-1">
                Le mot de passe doit respecter les critères suivants :
              </p>
              <CriteriaItem
                met={hasUpperCase}
                label="Contient une lettre majuscule"
              />
              <CriteriaItem met={hasNumber} label="Contient un chiffre" />
              <CriteriaItem
                met={hasSpecialChar}
                label="Contient un caractère spécial"
              />
              <CriteriaItem
                met={isAtLeast8Chars}
                label="Contient au moins 8 caractères"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PasswordStrengthChecker;
