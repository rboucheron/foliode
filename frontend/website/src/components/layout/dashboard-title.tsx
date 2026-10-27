import { UserAvatar } from "@/features/user/ui/user-avatar"

export function DashboardTitle({ title }: { title: string }) {
  return (
    <div className="flex w-full items-center justify-between pb-3">
      <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
      <UserAvatar size={40} />
    </div>
  )
}
