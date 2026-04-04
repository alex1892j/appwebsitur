import { useEffect, useState } from "react";
import AppointmentsTable from "./AppointmentsTable";
import { getAllAppointments } from "./services/appointments.service";


function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    const data = await getAllAppointments();
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <p>Cargando turnos...</p>;

  return (
    <AppointmentsTable
      appointments={appointments}
      showUserColumn
      onRefresh={fetchAppointments}
    />
  );
}

export default AllAppointments;
