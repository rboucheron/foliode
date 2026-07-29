import { ReactNode } from "react";

interface DashboardTitleProps {
  title: string;
  avatar?: ReactNode;
}

export const DashboardTitle = ({ title, avatar }: DashboardTitleProps) => {
  return (
    <div className="w-full flex items-center justify-between pb-3">
      <h1 className="font-bold text-xl md:text-2xl">{title}</h1>
      {avatar}
    </div>
  );
};
