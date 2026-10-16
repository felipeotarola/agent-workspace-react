import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else dialog.current?.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="ui-dialog"
      aria-labelledby={id}
      aria-describedby={description ? `${id}-description` : undefined}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <header className="ui-dialog-heading">
        <div>
          <h2 id={id}>{title}</h2>
          {description && <p id={`${id}-description`}>{description}</p>}
        </div>
        <Button
          shape="icon"
          size="sm"
          aria-label="Stäng dialog"
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </header>
      {children}
    </dialog>
  );
}
