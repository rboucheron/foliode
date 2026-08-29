export const extractToken = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") return null;

  const directToken = (payload as { token?: unknown }).token;
  if (typeof directToken === "string" && directToken.length > 0) {
    return directToken;
  }

  const nestedData = (payload as { data?: unknown }).data;
  if (nestedData && typeof nestedData === "object") {
    const nestedToken = (nestedData as { token?: unknown }).token;
    if (typeof nestedToken === "string" && nestedToken.length > 0) {
      return nestedToken;
    }
  }

  return null;
};
