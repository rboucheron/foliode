export const assertDevelopment = (): void => {
  if (!import.meta.env.DEV || process.env.NODE_ENV === "production") {
    throw new Error("Les outils de traduction sont désactivés en production.")
  }
}
