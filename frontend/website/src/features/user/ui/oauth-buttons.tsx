import { FaDribbble, FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { startOAuthSignIn } from "../application/session"

interface OAuthButtonProps {
  disabled?: boolean
}

export function GithubAuthButton({ disabled = false }: OAuthButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      disabled={disabled}
      onClick={() => startOAuthSignIn("github")}
      data-testid="github-submit"
      className="w-full flex-1 border-transparent bg-[#24292F] font-semibold text-white hover:bg-[#1B1F23]"
    >
      <FaGithub />
      GitHub
    </Button>
  )
}

export function DribbbleAuthButton({ disabled = false }: OAuthButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      disabled={disabled}
      onClick={() => startOAuthSignIn("dribbble")}
      data-testid="dribbble-submit"
      className="w-full flex-1 border-transparent bg-[#EA4C89] font-semibold text-white hover:bg-[#DF3E7B]"
    >
      <FaDribbble />
      Dribbble
    </Button>
  )
}
