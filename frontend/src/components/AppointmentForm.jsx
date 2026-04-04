import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/useAuth";


const API_APPOINTMENTS = "http://localhost:3000/api/appointments";

// ⏰ Horarios permitidos (09:00 - 21:00)
const AVAILABLE_HOURS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00", "21:00",
];

export default function AppointmentForm() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { producto } = location.state || {};

  const [form, setForm] = useState({
    username: user?.username || "",
    date: "",
    time: "",
    phoneNumber: "",
    productId: producto?.id || null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (user) {
    setForm((prev) => ({
      ...prev,
      username: user.username || user.nombre || "",
    }));
  }
}, [user]);

  if (!producto) {
    return <p>No se seleccionó ningún producto ❌</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return alert("No autorizado ❌");

    if (!form.time) {
      return alert("Seleccione un horario válido ⏰");
    }

    setLoading(true);

    try {
      await axios.post(
        API_APPOINTMENTS,
        {
          username: form.username,
          productId: form.productId,
          date: form.date,
          time: form.time,
          phoneNumber: form.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ADMIN_NUMBER = "981545388";

      const message = `*NUEVA RESERVA* 📅%0A` +
                    `--------------------------%0A` +
                    `👤 *Cliente:* ${form.username}%0A` +
                    `🛠️ *Servicio:* ${producto.nombre}%0A` +
                    `📅 *Fecha:* ${form.date}%0A` +
                    `⏰ *Hora:* ${form.time}%0A` +
                    `📱 *Teléfono:* ${form.phoneNumber}%0A` +
                    `--------------------------%0A` +
                    `_Enviado desde el Sistema de Reservas_`;

    const whatsappUrl = `https://wa.me/${ADMIN_NUMBER}?text=${message}`;

    alert("Turno reservado en el sistema ✅. Ahora te redirigiremos a WhatsApp para confirmar.");
    window.open(whatsappUrl, "_blank");
   

      alert("Turno reservado correctamente ✅");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error reservando turno ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="appointment-container">
      <h2 className="title">Reservar turno</h2>

      <div className="product-summary">
        <p><strong>Servicio:</strong> {producto.nombre}</p>
        <p><strong>Precio:</strong> S/ {producto.precio}</p>
      </div>

      <form className="appointment-form" onSubmit={handleSubmit}>

        <label className="form-label">
          Usuario:
          <input
            type="text"
            value={form.username}
            className="form-input"
            readOnly
          />
        </label>

        <label className="form-label">
          Teléfono:
          <input
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Fecha:
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Hora:
          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Seleccione un horario</option>
            {AVAILABLE_HOURS.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Reservando..." : "Reservar"}
        </button>
      </form>
    </section>
  );
}
