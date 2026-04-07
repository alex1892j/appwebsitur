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

  const handleCancelClick = (id) => {
    setModalConfig({ id, type: "cancel" });
    setConfirmOpen(true);
  };

  const handleDeleteClick = (id) => {
    setModalConfig({ id, type: "delete" });
    setConfirmOpen(true);
  };

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
      setAlertMessage(`Error al ${modalConfig.type === "cancel" ? "cancelar" : "eliminar"} el turno`);
      setAlertOpen(true);
    } finally {
      setConfirmOpen(false);
      setModalConfig({ id: null, type: null });
    }
  };

  return (
    <div className="table-container">
      <table className="appointments-table">
        <thead>
          <tr>
            {showUserColumn && <th>Usuario</th>}
            {showUserColumn && <th>Celular</th>}
            <th>Servicio</th>
            <th>Total</th>
            <th>Seña (50%)</th>
            <th>Restante</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Comprobante</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={showUserColumn ? 12 : 10} className="empty-row">
                No hay registros disponibles
              </td>
            </tr>
          ) : (
            appointments.map((appt) => {
              // Cálculos de pago
              const precioTotal = parseFloat(appt.product?.precio || 0);
              const pagado = precioTotal / 2;
              const restante = precioTotal - pagado;

              return (
                <tr key={appt.id}>
                  {showUserColumn && (
                    <td data-label="Usuario">
                      <div style={{ fontWeight: "bold" }}>{appt.user?.username || "—"}</div>
                    </td>
                  )}

                  {showUserColumn && (
                    <td data-label="Celular">
                      <small>{appt.phoneNumber}</small>
                    </td>
                  )}
                  
                  <td data-label="Servicio">
                    <span className="product-tag">
                      {appt.product?.nombre || "Servicio"}
                    </span>
                  </td>

                  <td data-label="Total">
                    <span style={{ fontWeight: "bold" }}>${precioTotal.toFixed(2)}</span>
                  </td>

                  <td data-label="pagado (50%)">
                    <span style={{ color: "#28a745", fontWeight: "bold" }}>${pagado.toFixed(2)}</span>
                  </td>

                  <td data-label="Restante">
                    <span style={{ color: "#dc3545", fontWeight: "bold" }}>${restante.toFixed(2)}</span>
                  </td>

                  <td data-label="Fecha">
                    <div>{appt.date}</div>
                  </td>

                  <td data-label="Hora">
                    <small style={{ color: "#007bff", fontWeight: "bold" }}>{appt.time}</small>
                  </td>

                  <td data-label="Comprobante" className="proof-cell">
                    {appt.paymentImageUrl ? (
                      <div className="thumbnail-wrapper" onClick={() => setSelectedImage(appt.paymentImageUrl)}>
                        <img src={appt.paymentImageUrl} alt="Pago" className="payment-thumbnail" />
                        <div className="thumbnail-overlay"><span>Ampliar</span></div>
                      </div>
                    ) : <span className="no-proof">Sin archivo</span>}
                  </td>

                  <td data-label="Estado">
                    <span className={`status-pill ${appt.status}`}>
                      {appt.status}
                    </span>
                  </td>

                  <td data-label="Acciones" className="actions-cell">
                    {appt.status !== "cancelled" && (
                      <button className="btn-cancel" onClick={() => handleCancelClick(appt.id)}>
                        Cancelar
                      </button>
                    )}
                    {isAdmin && (
                      <button className="btn-delete" onClick={() => handleDeleteClick(appt.id)}>
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* --- MODALES --- */}
      {selectedImage && (
        <div className="image-fullscreen-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Pago Ampliado" className="fullscreen-image" />
            <button className="close-modal-btn" onClick={() => setSelectedImage(null)}>×</button>
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