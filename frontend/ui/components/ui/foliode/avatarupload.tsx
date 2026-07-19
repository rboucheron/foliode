"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

import { HerouiModal } from "../heroui/modal";
import { FileInput } from "./fileinput";
import { Avatar } from "./avatar";

interface AvatarUploadProps {
  avatarUrl: string | null;
  size: number;
  onSubmit: (file: File) => void;
}

export const AvatarUpload = ({ avatarUrl, size, onSubmit }: AvatarUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {avatarUrl && <Avatar avatarUrl={avatarUrl} size={size} />}
      </div>

      <HerouiModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Modifier votre photo de profil"
        footer={(close) => (
          <>
            <Button color="danger" variant="light" onPress={close}>
              Annuler
            </Button>
            {file && (
              <Button
                color="primary"
                onPress={() => {
                  close();
                  onSubmit(file);
                }}
              >
                Ajouter
              </Button>
            )}
          </>
        )}
      >
        <FileInput onChange={(images) => setFile(images[0])} files={file ? [file] : []} />
      </HerouiModal>
    </>
  );
};
