import { createPortal } from "react-dom";

function ConfirmModal({
  open,
  title,
  message,
  danger = false,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>

          <button
            className={`btn-confirm ${danger ? "danger" : ""}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmModal;
