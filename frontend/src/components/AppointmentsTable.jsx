import { useState } from "react";
import ConfirmModal from "./modal/ConfirmModal";
import AlertModal from "./modal/AlertModal";
import { cancelAppointment, deleteAppointment } from "./services/appointments.service";
import { useAuth } from "../context/useAuth"; // 1. Importamos el hook de autenticación

function AppointmentsTable({
  appointments,
  showUserColumn = false,
  onRefresh,
}) {
  const { user } = useAuth(); // 2. Obtenemos los datos del usuario actual
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ id: null, type: null });
  const [alertMessage, setAlertMessage] = useState("");

  // Verificamos si el usuario es administrador
  // Ajusta 'admin' según cómo lo manejes en tu DB (ej. user.role === 'ADMIN')
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
    <>
      <table className="appointments-table">
        <thead>
          <tr>
            {showUserColumn && <th>Usuario</th>}
            <th>Servicio</th>
            <th>Fecha / Hora</th>
            <th>Pago</th>
            <th>Comprobante</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={showUserColumn ? 7 : 6} style={{ textAlign: "center", padding: "2rem" }}>
                No hay registros disponibles
              </td>
            </tr>
          ) : (
            appointments.map((appt) => (
              <tr key={appt.id}>
                {showUserColumn && (
                  <td>
                    <div style={{ fontWeight: "bold" }}>{appt.user?.username || "—"}</div>
                    <small>{appt.phoneNumber}</small>
                  </td>
                )}
                
                <td>
                  <span className="product-tag">
                    {appt.product?.nombre || "Servicio"}
                  </span>
                </td>

                <td>
                  <div>{appt.date}</div>
                  <small style={{ color: "#007bff", fontWeight: "bold" }}>{appt.time}</small>
                </td>

                <td>
                  <span className={`badge-payment ${appt.paymentMethod}`}>
                    {appt.paymentMethod?.toUpperCase() || "—"}
                  </span>
                </td>

                <td>
                  {appt.paymentScreenshotUrl ? (
                    <a href={appt.paymentImageUrl} target="_blank" rel="noreferrer" className="view-link">
                      Ver Pago 📄
                    </a>
                  ) : "—"}
                </td>

                <td>
                  <span className={`status-pill ${appt.status}`}>
                    {appt.status}
                  </span>
                </td>

                <td className="actions-cell">
                  {/* El botón Cancelar lo ven todos si la cita está activa */}
                  {appt.status !== "cancelled" && (
                    <button className="btn-cancel" onClick={() => handleCancelClick(appt.id)}>
                      Cancelar
                    </button>
                  )}
                  
                  {/* 3. BOTÓN ELIMINAR: Solo renderiza si isAdmin es true */}
                  {isAdmin && (
                    <button className="btn-delete" onClick={() => handleDeleteClick(appt.id)}>
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ConfirmModal
        open={confirmOpen}
        title={modalConfig.type === "cancel" ? "Cancelar Turno" : "Eliminar Turno"}
        message={
          modalConfig.type === "cancel" 
            ? "¿Deseas marcar este turno como cancelado?" 
            : "Esta acción es irreversible. ¿Realmente deseas eliminar este registro de la base de datos?"
        }
        danger={modalConfig.type === "delete"}
        confirmText={modalConfig.type === "cancel" ? "Sí, cancelar" : "Sí, eliminar"}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmOpen(false)}
      />

      <AlertModal
        open={alertOpen}
        title="Notificación"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />

      <style>{`
        .product-tag {
          background: #f0f2f5;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
          border: 1px solid #dcdfe3;
        }
        .actions-cell {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .btn-delete {
          background: #dc3545;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: bold;
        }
        .btn-delete:hover { background: #a71d2a; }
        
        .badge-payment.yape { background: #742284; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; }
        .badge-payment.plin { background: #00d1ce; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; }
        
        .status-pill { padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; text-transform: capitalize; }
        .status-pill.active { background: #fff3cd; color: #856404; }
        .status-pill.cancelled { background: #f8d7da; color: #721c24; }
      `}</style>
    </>
  );
}

export default AppointmentsTable;
