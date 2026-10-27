import { linkOAuthUser } from "./auth.api";
import type { OAuthProvider } from "../domain/user";

interface ProviderConfig {
  authorizeUrl: string;
  tokenUrl: string;
  scope: string;
  clientId: string | undefined;
  clientSecret: string | undefined;
  fetchEmail: (accessToken: string) => Promise<string | null>;
}

const fetchGitHubEmail = async (
  accessToken: string,
): Promise<string | null> => {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (!response.ok) return null;

  const emails: unknown = await response.json();
  if (!Array.isArray(emails)) return null;

  const primary = emails.find(
    (entry): entry is { email: string } =>
      typeof entry === "object" &&
      entry !== null &&
      entry.primary === true &&
      typeof entry.email === "string",
  );
  return primary?.email ?? null;
};

const getProviderConfig = (provider: OAuthProvider): ProviderConfig => {
  switch (provider) {
    case "github":
      return {
        authorizeUrl: "https://github.com/login/oauth/authorize",
        tokenUrl: "https://github.com/login/oauth/access_token",
        scope: "read:user user:email",
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
        fetchEmail: fetchGitHubEmail,
      };
    case "dribbble":
      return {
        authorizeUrl: "https://dribbble.com/oauth/authorize",
        tokenUrl: "https://dribbble.com/oauth/token",
        scope: "public",
        clientId: process.env.AUTH_DRIBBBLE_ID,
        clientSecret: process.env.AUTH_DRIBBBLE_SECRET,
        fetchEmail: async () => null,
      };
  }
};

export const OAUTH_STATE_COOKIE = "oauth_state";

const callbackUrl = (request: Request, provider: OAuthProvider): string =>
  new URL(`/api/auth/callback/${provider}`, request.url).toString();

export const isProviderConfigured = (provider: OAuthProvider): boolean => {
  const { clientId, clientSecret } = getProviderConfig(provider);
  return Boolean(clientId && clientSecret);
};

export const buildAuthorizeUrl = (
  request: Request,
  provider: OAuthProvider,
  state: string,
): string => {
  const config = getProviderConfig(provider);
  const url = new URL(config.authorizeUrl);
  url.searchParams.set("client_id", config.clientId ?? "");
  url.searchParams.set("redirect_uri", callbackUrl(request, provider));
  url.searchParams.set("scope", config.scope);
  url.searchParams.set("state", state);
  url.searchParams.set("response_type", "code");
  return url.toString();
};

const exchangeCode = async (
  request: Request,
  provider: OAuthProvider,
  code: string,
): Promise<string> => {
  const config = getProviderConfig(provider);
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: config.clientId ?? "",
      client_secret: config.clientSecret ?? "",
      code,
      redirect_uri: callbackUrl(request, provider),
      grant_type: "authorization_code",
    }),
  });

  const payload: unknown = await response.json();
  if (
    !response.ok ||
    !payload ||
    typeof payload !== "object" ||
    !("access_token" in payload) ||
    typeof payload.access_token !== "string"
  ) {
    throw new Error(`OAuth token exchange failed for ${provider}`);
  }
  return payload.access_token;
};

export const completeOAuthSignIn = async (
  request: Request,
  provider: OAuthProvider,
  code: string,
): Promise<string> => {
  const accessToken = await exchangeCode(request, provider, code);
  const email = await getProviderConfig(provider).fetchEmail(accessToken);
  const { token } = await linkOAuthUser(provider, {
    token: accessToken,
    email,
  });
  return token;
};

interface CookieOptions {
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
}

export const serializeCookie = (
  name: string,
  value: string,
  options: CookieOptions = {},
): string =>
  [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "SameSite=Lax",
    options.maxAge !== undefined ? `Max-Age=${options.maxAge}` : null,
    options.httpOnly ? "HttpOnly" : null,
    options.secure ? "Secure" : null,
  ]
    .filter(Boolean)
    .join("; ");

export const readRequestCookie = (
  request: Request,
  name: string,
): string | null => {
  for (const cookie of (request.headers.get("cookie") ?? "").split(/;\s*/)) {
    const [key, ...rest] = cookie.split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
};

export const redirectTo = (
  request: Request,
  path: string,
  cookies: string[] = [],
): Response => {
  const headers = new Headers({
    Location: new URL(path, request.url).toString(),
  });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
};
