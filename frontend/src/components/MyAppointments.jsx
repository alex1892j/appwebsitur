import { useEffect, useState } from "react";
import AppointmentsTable from "./AppointmentsTable";
import { getMyAppointments } from "./services/appointments.service";


function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    const data = await getMyAppointments();
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
      onRefresh={fetchAppointments}
    />
  );
}

export default MyAppointments;

