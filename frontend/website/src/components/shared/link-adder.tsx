import { useRef, useState } from "react"
import { ExternalLinkIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProjectLink } from "@/features/project/domain/project"

interface LinkAdderProps {
  value?: ProjectLink[]
  onChange: (links: ProjectLink[]) => void
}

const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/

const normalizeUrl = (url: string): string =>
  url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`

export function LinkAdder({ value = [], onChange }: LinkAdderProps) {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const addLink = () => {
    if (!name || !url) return

    const formattedUrl = normalizeUrl(url.trim())
    if (!URL_REGEX.test(formattedUrl)) {
      setError("L'URL doit être au format https://exemple.fr")
      return
    }

    setError(null)
    onChange([...value, { name: name.trim(), url: formattedUrl }])
    setName("")
    setUrl("")
    nameInputRef.current?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      addLink()
    }
  }

  return (
    <div className="w-full space-y-2">
      <Label>Liens du projet</Label>
      <div className="flex gap-2">
        <Input
          ref={nameInputRef}
          placeholder="Foliode"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Nom du lien"
        />
        <Input
          placeholder="https://foliode.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="URL du lien"
          aria-invalid={Boolean(error)}
        />
        <Button type="button" variant="outline" size="icon" onClick={addLink} aria-label="Ajouter le lien">
          <PlusIcon />
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {value.length > 0 && (
        <ul className="flex flex-col gap-2">
          {value.map((link, index) => (
            <li
              key={`${link.url}-${index}`}
              className="flex items-center justify-between rounded-lg border border-primary/40 px-3 py-2"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {link.name}
                <ExternalLinkIcon className="size-3.5" />
              </a>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Supprimer ${link.name}`}
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="text-destructive hover:text-destructive"
              >
                <Trash2Icon />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
