import type {
  AuthResponseDTO,
  AuthSignInRequestDTO,
  AuthSignUpRequestDTO,
  OAuthUserLinkRequestDTO,
  OAuthUserLinkResponseDTO,
} from "../contract/auth.dto";
import { postJson } from "./http";

export const signUpUser = async (user: AuthSignUpRequestDTO): Promise<AuthResponseDTO> => {
  return postJson<AuthResponseDTO>("/api/user/signup", user);
};

export const signInUser = async (user: AuthSignInRequestDTO): Promise<AuthResponseDTO> => {
  return postJson<AuthResponseDTO>("/api/user/signin", user);
};

export const authenticateGitHubUser = async (
  payload: OAuthUserLinkRequestDTO
): Promise<OAuthUserLinkResponseDTO> => {
  return postJson<OAuthUserLinkResponseDTO>("/api/user/auth/github", payload);
};

export const authenticateDribbbleUser = async (
  payload: OAuthUserLinkRequestDTO
): Promise<OAuthUserLinkResponseDTO> => {
  return postJson<OAuthUserLinkResponseDTO>("/api/user/auth/dribbble", payload);
};

export const apiSignUpUser = signUpUser;
export const apiSignInUser = signInUser;
export const githubAuth = authenticateGitHubUser;
export const dribbbleAuth = authenticateDribbbleUser;