type ConfirmModalProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmModal = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6"
      >
        <h2 className="text-lg font-bold text-on-surface">{title}</h2>
        <p className="text-on-surface-variant mt-2 text-sm">{message}</p>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-outline text-on-surface font-semibold hover:bg-surface-container-low transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 rounded-full font-bold transition-colors ${
              isDestructive
                ? 'bg-error text-on-error hover:opacity-90'
                : 'bg-primary text-white hover:bg-primary-container'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
