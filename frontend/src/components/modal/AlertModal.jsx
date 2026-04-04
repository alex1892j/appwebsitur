import { createPortal } from "react-dom";

function AlertModal({ open, title, message, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button className="btn-confirm" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AlertModal;