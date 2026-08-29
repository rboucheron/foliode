export const SESSION_COOKIE_NAME = "token_auth";

export const isSessionExpired = (expSeconds: number): boolean => {
  return expSeconds * 1000 < Date.now();
};

export const passwordsMatch = (password: string, confirmation: string): boolean => {
  return password === confirmation;
};
