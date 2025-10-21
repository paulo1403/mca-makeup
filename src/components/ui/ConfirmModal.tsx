"use client";

import Modal, { ModalHeader, ModalBody, ModalFooter } from "./Modal";
import Button from "@/components/ui/Button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  destructive?: boolean;
  icon?: React.ReactNode;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  destructive = false,
  icon,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      closeOnBackdrop
      closeOnEsc
      ariaLabelledBy="confirm-modal-title"
      ariaDescribedBy="confirm-modal-description"
      size="sm"
    >
      <ModalHeader
        title={
          <span id="confirm-modal-title" className="inline-flex items-center gap-2">
            {icon}
            {title}
          </span>
        }
        onClose={onCancel}
      />
      <ModalBody>
        <p id="confirm-modal-description" className="text-[color:var(--color-body)]">
          {description}
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost"
            size="md"
            className="min-w-[120px]"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            variant={destructive ? "danger" : "primary"}
            size="md"
            className="min-w-[140px]"
          >
            {confirmText}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}