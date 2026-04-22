import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Dribbble from "next-auth/providers/dribbble"
import { authenticateDribbbleUser, authenticateGitHubUser } from "api/src/client/auth"

import { cookies } from "next/headers"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Dribbble({ scope: 'public' })],

  pages: {
    error: '/login'
  },
  callbacks: {
    async redirect() {
      return `/dashboard`;
    },

    async jwt({ token, account }) {
      if (account?.provider && account.access_token) {
        const payload = { token: account.access_token, email: token.email ?? null }

        const userAuth = account.provider === "dribbble"
          ? await authenticateDribbbleUser(payload)
          : await authenticateGitHubUser(payload)

        const cookieStore = await cookies()
        cookieStore.set({ name: "token_auth", value: userAuth.token, path: "/" })
      }

      return token;
    }
  }
})