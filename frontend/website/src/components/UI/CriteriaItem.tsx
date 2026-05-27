import { LuCircleCheck } from "react-icons/lu";
import { LuCircleX } from "react-icons/lu";

export const CriteriaItem = ({
  met,
  label,
}: {
  met: boolean;
  label: string;
}) => {
  return (
    <div className="flex items-center space-x-2">
      {met ? (
        <LuCircleCheck className="h-5 w-5 text-[#44c964]" aria-hidden="true" />
      ) : (
        <LuCircleX className="h-5 w-5 text-[#F31260]" aria-hidden="true" />
      )}
      <span className="sr-only">{met ? "Validé : " : "Non validé : "}</span>
      <span className={met ? "text-[#44c964]" : "text-[#F31260]"}>{label}</span>
    </div>
  );
};