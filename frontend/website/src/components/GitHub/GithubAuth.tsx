"use client";

import { signInGitHub } from "@/actions";
import { FoliodeButton } from "@rboucheron/ui";
import { FaGithub } from "react-icons/fa";

export default function SignIn({ disable = false }) {
  return (
    <form action={signInGitHub} className="w-full">
      <FoliodeButton 
        text="GitHub"
        style="form"
        icon={<FaGithub className="text-lg" />}
        type="submit"
        isDisabled={disable}
        className="!bg-[#24292F] hover:!bg-[#1B1F23] !border-transparent !text-white font-semibold transition-all duration-200"
        testId="github-submit"
      />
    </form>
  );
}