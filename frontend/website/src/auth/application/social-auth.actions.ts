"use server";

import { signIn } from "./auth.config";

export async function signInGitHub() {
  await signIn("github");
}

export async function signInDribbble() {
  await signIn("dribbble");
}
