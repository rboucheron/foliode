"use client";

import { useState } from "react";
import { HerouiModal as Modal } from "../ui/heroui/modal";
import { HerouiButton as Button } from "../ui/heroui/button";
import { FileInput } from "../ui/foliode/fileinput";

type labels = {
  button: {
    cancel: string
    add: string
  }
}

interface AvatarUploadProps {
  onSubmit: (file: File) => void;
  onClose?: () => void;
  isOpen: boolean;
  labels: labels

}

export const AvatarUpload = ({ onSubmit, onClose, isOpen, labels }: AvatarUploadProps) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => { }}
        title="Modifier votre photo de profil"
        footer={
          <>
            <Button
              text={labels.button.cancel}
              variant="primary"
              size="md"
              onPress={onClose}
              testId="portfolio-edit-next-step"
              className="dayMode bg-red-500 text-white"
            />
            {file && (
              <Button
                text={labels.button.add}
                variant="primary"
                size="md"
                onPress={() => {
                  onSubmit(file);
                  onClose && onClose();
                }}
                testId="portfolio-edit-next-step"
                className="dayMode bg-blue-500 text-white"
              />
            )}
          </>
        }
      >
        <FileInput onChange={(images) => setFile(images[0])} files={file ? [file] : []} />
      </Modal>
    </>
  );
};
