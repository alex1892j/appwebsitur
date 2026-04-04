import { useState } from "react";
import ConfirmModal from "./modal/ConfirmModal";
import AlertModal from "./modal/AlertModal";
import { cancelAppointment } from "./services/appointments.service";

function AppointmentsTable({
  appointments,
  showUserColumn = false,
  onRefresh,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const handleCancelClick = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelAppointment(selectedId);
      setAlertMessage("Turno cancelado correctamente");
      setAlertOpen(true);
      onRefresh();
    } catch (error) {
      setAlertMessage("Error al cancelar el turno");
      setAlertOpen(true);
    } finally {
      setConfirmOpen(false);
      setSelectedId(null);
    }
  };

  return (
    <>
      <table className="appointments-table">
        <thead>
          <tr>
            {showUserColumn && <th>Usuario</th>}
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={showUserColumn ? 5 : 4}>
                No hay turnos disponibles
              </td>
            </tr>
          ) : (
            appointments.map((appt) => (
              <tr key={appt.id}>
                {showUserColumn && (
                  <td>{appt.user?.username || "—"}</td>
                )}
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>{appt.status}</td>
                <td>
                  {appt.status !== "cancelled" && (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelClick(appt.id)}
                    >
                      Cancelar
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
        title="Cancelar turno"
        message="¿Estás seguro de que deseas cancelar este turno?"
        danger
        confirmText="Sí, cancelar"
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmOpen(false)}
      />

      <AlertModal
        open={alertOpen}
        title="Información"
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
}

export default AppointmentsTable;
