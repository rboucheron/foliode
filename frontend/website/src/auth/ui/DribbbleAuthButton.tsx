"use client";

import { FoliodeButton } from "@rboucheron/ui";
import { FaDribbble } from "react-icons/fa";
import { signInDribbble } from "../application/social-auth.actions";

export default function DribbbleAuthButton({ disable = false }) {
  return (
    <form action={signInDribbble} className="w-full">
      <FoliodeButton
        text="Dribbble"
        style="form"
        icon={<FaDribbble className="text-lg" />}
        type="submit"
        isDisabled={disable}
        className="!bg-[#EA4C89] hover:!bg-[#DF3E7B] !border-transparent !text-white font-semibold transition-all duration-200"
        testId="dribbble-submit"
      />
    </form>
  );
}
