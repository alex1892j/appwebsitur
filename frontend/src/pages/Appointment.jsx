import { useState } from "react";
import AppointmentForm from "../components/AppointmentForm";
import MyAppointments from "../components/MyAppointments";
import AllAppointments from "../components/AllAppointments";
import { useAuth } from "../context/useAuth";
import { isAdmin, isUser } from "../utils/roles";


function Appointment() {
  const { user } = useAuth();
  const [view, setView] = useState(null);

  return (
    <div className="product-form-wrapper">
      <h1>Agendar Cita</h1>
      <AppointmentForm />

      {isUser(user) && (
        <button onClick={() => setView("my")}>
          Ver mis turnos
        </button>
      )}

      {isAdmin(user) && (
        <button onClick={() => setView("all")}>
          Ver todos los turnos
        </button>
      )}

      {view === "my" && <MyAppointments />}
      {view === "all" && <AllAppointments />}
    </div>
  );
}

export default Appointment;

