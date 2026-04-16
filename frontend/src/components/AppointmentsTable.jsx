import { useState } from "react";
import ConfirmModal from "./modal/ConfirmModal";
import AlertModal from "./modal/AlertModal";
import { cancelAppointment, deleteAppointment } from "./services/appointments.service";
import { useAuth } from "../context/useAuth";

function AppointmentsTable({
  appointments,
  showUserColumn = false,
  onRefresh,
}) {
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ id: null, type: null });
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const isAdmin = user?.role === "admin";

  // Invertimos para que el último turno aparezca primero a la izquierda
  const sortedAppointments = [...appointments].reverse();

  const handleConfirmAction = async () => {
    try {
      if (modalConfig.type === "cancel") {
        await cancelAppointment(modalConfig.id);
        setAlertMessage("Turno cancelado correctamente");
      } else if (modalConfig.type === "delete") {
        await deleteAppointment(modalConfig.id);
        setAlertMessage("Turno eliminado definitivamente");
      }
      setAlertOpen(true);
      onRefresh();
    } catch (error) {
      setAlertMessage(`Error al procesar la solicitud`);
      setAlertOpen(true);
    } finally {
      setConfirmOpen(false);
      setModalConfig({ id: null, type: null });
    }
  };

  return (
    <div className="table-container">
      <div className="appointments-grid-horizontal">
        {sortedAppointments.length === 0 ? (
          <div className="empty-state">No hay registros disponibles</div>
        ) : (
          sortedAppointments.map((appt) => {
            const precioTotal = parseFloat(appt.product?.precio || 0);
            const pagado = precioTotal / 2;
            const restante = precioTotal - pagado;

            return (
              <div key={appt.id} className="appointment-card-column">
                {showUserColumn && (
                  <div className="info-row">
                    <span className="label">Usuario:</span>
                    <strong className="value">{appt.user?.username || "—"}</strong>
                  </div>
                )}
                {showUserColumn && (
                  <div className="info-row">
                    <span className="label">Celular:</span>
                    <span className="value">{appt.phoneNumber}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="label">Servicio:</span>
                  <span className="product-tag">{appt.product?.nombre || "Servicio"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Total:</span>
                  <strong className="value">${precioTotal.toFixed(2)}</strong>
                </div>
                <div className="info-row">
                  <span className="label">Seña (50%):</span>
                  <strong className="value" style={{ color: "#28a745" }}>${pagado.toFixed(2)}</strong>
                </div>
                <div className="info-row">
                  <span className="label">Restante:</span>
                  <strong className="value" style={{ color: "#dc3545" }}>${restante.toFixed(2)}</strong>
                </div>
                <div className="info-row">
                  <span className="label">Fecha:</span>
                  <span className="value">{appt.date}</span>
                </div>
                <div className="info-row">
                  <span className="label">Hora:</span>
                  <strong className="value" style={{ color: "#007bff" }}>{appt.time}</strong>
                </div>

                {/* --- CORRECCIÓN DE COMPROBANTE --- */}
                <div className="info-row proof-section">
                  <span className="label">Comprobante:</span>
                  <div className="thumbnail-container">
                    {appt.paymentImageUrl ? (
                      <div 
                        className="payment-thumb" 
                        onClick={() => setSelectedImage(appt.paymentImageUrl)}
                      >
                        <img src={appt.paymentImageUrl} alt="Miniatura Pago" />
                        <div className="thumb-overlay"><span>Ampliar</span></div>
                      </div>
                    ) : (
                      <span className="no-proof">Sin captura</span>
                    )}
                  </div>
                </div>

                <div className="info-row">
                  <span className="label">Estado:</span>
                  <span className={`status-pill ${appt.status}`}>{appt.status}</span>
                </div>

                <div className="actions-vertical">
                  {appt.status !== "cancelled" && (
                    <button className="bton-cancel" onClick={() => { setModalConfig({ id: appt.id, type: "cancel" }); setConfirmOpen(true); }}>
                      Cancelar
                    </button>
                  )}
                  {isAdmin && (
                    <button className="bton-delete" onClick={() => { setModalConfig({ id: appt.id, type: "delete" }); setConfirmOpen(true); }}>
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- MODAL PANTALLA COMPLETA --- */}
      {selectedImage && (
        <div className="image-fullscreen-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Pago Ampliado" className="fullscreen-image" />
            <button className="close-modal-btn" onClick={() => setSelectedImage(null)}>&times;</button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmOpen}
        title={modalConfig.type === "cancel" ? "Cancelar Turno" : "Eliminar Turno"}
        message={modalConfig.type === "cancel" ? "¿Deseas marcar este turno como cancelado?" : "Esta acción es irreversible."}
        danger={modalConfig.type === "delete"}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmOpen(false)}
      />

      <AlertModal open={alertOpen} title="Notificación" message={alertMessage} onClose={() => setAlertOpen(false)} />
    </div>
  );
}

export default AppointmentsTable;