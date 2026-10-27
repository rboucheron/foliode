import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CloudUploadIcon, ImageIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileInputProps {
  files: File[];
  onChange: (files: File[]) => void;
  id?: string;
  isRequired?: boolean;
  multiple?: boolean;
}

export function FileInput({
  files,
  onChange,
  id,
  isRequired,
  multiple = true,
}: FileInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [dragging, setDragging] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    inputRef.current.files = dataTransfer.files;
  }, [files]);

  const addFiles = useCallback(
    (added: File[]) => {
      if (added.length === 0) return;
      setIsInvalid(false);
      onChange(multiple ? [...files, ...added] : added.slice(0, 1));
    },
    [files, multiple, onChange],
  );

  const stop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const showError = isInvalid && files.length === 0;

  return (
    <div className="w-full">
      <div
        onDragOver={stop}
        onDragEnter={(event) => {
          stop(event);
          setDragging(true);
        }}
        onDragLeave={(event) => {
          stop(event);
          setDragging(false);
        }}
        onDrop={(event) => {
          stop(event);
          setDragging(false);
          addFiles(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "relative flex min-h-[200px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition-colors",
          dragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 hover:bg-primary/5",
          showError && "border-destructive hover:border-destructive",
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          name="file"
          type="file"
          accept="image/*"
          multiple={multiple}
          required={isRequired}
          onInvalid={() => setIsInvalid(true)}
          onChange={(event) => {
            addFiles(event.target.files ? Array.from(event.target.files) : []);
            event.target.value = "";
          }}
          className="sr-only"
        />
        <label
          htmlFor={inputId}
          className="flex size-full cursor-pointer flex-col items-center justify-center gap-2"
        >
          {files.length === 0 ? (
            <>
              <CloudUploadIcon
                className={cn(
                  "size-14",
                  showError ? "text-destructive" : "text-primary",
                )}
              />
              <span className="text-sm text-muted-foreground">
                Glissez vos images ici ou cliquez pour parcourir
              </span>
            </>
          ) : (
            <ul className="max-h-60 w-full space-y-2 overflow-y-auto">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-2 rounded-md bg-muted p-2"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <ImageIcon className="size-5 shrink-0 text-primary" />
                    <span className="truncate text-sm">{file.name}</span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Retirer ${file.name}`}
                    onClick={(event) => {
                      event.preventDefault();
                      onChange(files.filter((_, i) => i !== index));
                    }}
                    className="rounded-sm text-destructive transition-colors hover:text-destructive/70"
                  >
                    <XIcon className="size-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </label>
      </div>
      {showError && (
        <p className="mt-1 text-xs text-destructive">
          Veuillez ajouter un fichier.
        </p>
      )}
    </div>
  );
}
