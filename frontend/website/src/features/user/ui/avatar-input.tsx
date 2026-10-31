import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileInput } from "@/components/shared/file-input"
import { generateAvatar } from "@/lib/avatar"
import { formatImage } from "@/lib/format-image"
import { useTranslation } from "@/i18n"
import { useUserStore } from "../application/user.store"

export function AvatarInput({ size }: { size: number }) {
  const user = useUserStore((state) => state.user)
  const fetchFromJwt = useUserStore((state) => state.fetchFromJwt)
  const updateProfilePicture = useUserStore((state) => state.updateProfilePicture)
  const t = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchFromJwt()
  }, [fetchFromJwt])

  if (!user) return null

  const src = user.avatar_url ? formatImage(user.avatar_url) : generateAvatar(size, user.email)

  const handleSubmit = async () => {
    if (!file) return
    setIsOpen(false)
    try {
      await updateProfilePicture(file)
      setFile(null)
    } catch {
      toast.error(t("auth.avatar.updateFailed"))
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t("auth.avatar.edit")}
        className="rounded-full transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden"
      >
        <img
          src={src}
          alt={user.email || t("auth.avatar.alt")}
          width={size}
          height={size}
          className="rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("auth.avatar.edit")}</DialogTitle>
          </DialogHeader>
          <FileInput
            multiple={false}
            files={file ? [file] : []}
            onChange={(files) => setFile(files[0] ?? null)}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              {t("auth.avatar.cancel")}
            </Button>
            {file && <Button onClick={handleSubmit}>{t("auth.avatar.add")}</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
