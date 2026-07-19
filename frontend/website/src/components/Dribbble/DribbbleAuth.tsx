'use client';

import { FoliodeButton }  from '@rboucheron/ui';
import { signInDribbble } from '@/actions';
import { FaDribbble }     from 'react-icons/fa';

export default function SignIn({ disable = false }) {
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