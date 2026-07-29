"use client";

import { Modal } from "@heroui/react";
import type { ReactNode } from "react";

type ModalSize = "xs" | "sm" | "md" | "lg" | "full" | "cover";
type ModalPlacement = "auto" | "top" | "center" | "bottom";
type BackdropVariant = "opaque" | "blur" | "transparent";

interface HerouiModalProps {
  trigger?: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode | ((close: () => void) => ReactNode);
  size?: ModalSize;
  placement?: ModalPlacement;
  backdrop?: BackdropVariant;
  scroll?: "inside" | "outside";
  isDismissable?: boolean;
  hideCloseButton?: boolean;
}

export function HerouiModal({
  trigger,
  isOpen,
  defaultOpen,
  onOpenChange,
  icon,
  title,
  description,
  children,
  footer,
  size = "md",
  placement = "auto",
  backdrop = "opaque",
  scroll = "inside",
  isDismissable = true,
  hideCloseButton = false,
}: HerouiModalProps) {
  const hasHeader = Boolean(icon || title || description);

  return (
    <Modal
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger ? <Modal.Trigger>{trigger}</Modal.Trigger> : null}

      <Modal.Backdrop variant={backdrop} isDismissable={isDismissable}>
        <Modal.Container size={size} placement={placement} scroll={scroll}>
          <Modal.Dialog>
            {({ close }: { close: () => void }) => (
              <>
                {!hideCloseButton ? <Modal.CloseTrigger /> : null}

                {hasHeader ? (
                  <Modal.Header>
                    {icon ? <Modal.Icon>{icon}</Modal.Icon> : null}
                    {title ? <Modal.Heading>{title}</Modal.Heading> : null}
                    {description ? (
                      <p style={{ color: "var(--muted)", margin: 0 }}>
                        {description}
                      </p>
                    ) : null}
                  </Modal.Header>
                ) : null}

                {children ? <Modal.Body>{children}</Modal.Body> : null}

                {footer ? (
                  <Modal.Footer>
                    {typeof footer === "function" ? footer(close) : footer}
                  </Modal.Footer>
                ) : null}
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
