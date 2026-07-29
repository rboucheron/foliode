export const extractErrorMessage = (payload: unknown): string => {
  const fallback = "Une erreur est survenue lors de l'envoi du commentaire.";

  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const errorValue = (payload as { error?: unknown }).error;

  if (typeof errorValue === "string") {
    try {
      const parsed = JSON.parse(errorValue) as { error?: Record<string, string> };
      if (parsed?.error && typeof parsed.error === "object") {
        return Object.values(parsed.error).join(" ");
      }
    } catch {
      return errorValue;
    }
  }

  if (errorValue && typeof errorValue === "object") {
    return Object.values(errorValue as Record<string, string>).join(" ");
  }

  return fallback;
};

export const validateGuestComment = (input: {
  message: string;
  isAuthenticated: boolean;
  guestFirstname: string;
  guestLastname: string;
}): string | null => {
  if (input.message.trim() === "") {
    return "Le message est obligatoire.";
  }

  if (!input.isAuthenticated && input.guestFirstname.trim() === "") {
    return "Le prénom est obligatoire.";
  }

  if (!input.isAuthenticated && input.guestLastname.trim() === "") {
    return "Le nom est obligatoire.";
  }

  return null;
};
