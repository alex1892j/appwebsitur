import { useEffect, useState } from "react";
import AppointmentsTable from "./AppointmentsTable";
import { getAllAppointments } from "./services/appointments.service";

function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Nuevo estado para errores

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAppointments();
      // Verificamos que data sea un array para evitar errores en el .map() de la tabla
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando turnos:", err);
      setError("No se pudieron cargar los turnos. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <p className="loading-text">Cargando turnos...</p>;
  
  if (error) return (
    <div className="error-container">
      <p>{error}</p>
      <button onClick={fetchAppointments}>Reintentar</button>
    </div>
  );

  return (
    <div className="admin-appointments-view">
      <header className="view-header">
        <h2>Panel de Administración - Turnos</h2>
        <button className="btn-refresh" onClick={fetchAppointments}>
          Actualizar Lista 🔄
        </button>
      </header>

      <AppointmentsTable
        appointments={appointments}
        showUserColumn={true}
        onRefresh={fetchAppointments}
      />
    </div>
  );
}

export default AllAppointments;