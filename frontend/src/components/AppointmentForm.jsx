import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/useAuth";

const API_APPOINTMENTS = "http://localhost:3000/api/appointments";
const ADMIN_NUMBER = "981545388"; 

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
  
  // --- CORRECCIÓN DE TIPO ---
  // Convertimos a número para evitar el error .toFixed()
  const precioTotal = Number(producto?.precio) || 0;
  const precioAdelanto = precioTotal / 2;

  const [form, setForm] = useState({
    username: user?.username || "",
    date: "",
    time: "",
    phoneNumber: "",
    productId: producto?.id || null,
    paymentMethod: "", 
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        username: user.username || user.nombre || "",
      }));
    }
  }, [user]);

  if (!producto) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>No se seleccionó ningún producto ❌</p>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(ADMIN_NUMBER);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return alert("No autorizado ❌");
    if (!form.time) return alert("Seleccione un horario válido ⏰");
    if (!paymentScreenshot) return alert("Por favor, sube el comprobante de pago del 50% 📄");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("productId", form.productId);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("paymentMethod", form.paymentMethod);
      
      if (paymentScreenshot) {
        formData.append("file", paymentScreenshot); 
      }

      await axios.post(API_APPOINTMENTS, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const message = `*NUEVA RESERVA (ADELANTO 50%)* 📅%0A` +
        `--------------------------%0A` +
        `👤 *Cliente:* ${form.username}%0A` +
        `🛠️ *Servicio:* ${producto.nombre}%0A` +
        `📅 *Fecha:* ${form.date}%0A` +
        `⏰ *Hora:* ${form.time}%0A` +
        `📱 *Teléfono:* ${form.phoneNumber}%0A` +
        `💰 *Precio Total:* S/ ${precioTotal.toFixed(2)}%0A` +
        `💳 *Adelanto Pagado (50%):* S/ ${precioAdelanto.toFixed(2)}%0A` +
        `📌 *Método:* ${form.paymentMethod.toUpperCase()}%0A` +
        `--------------------------%0A` +
        `_Reserva realizada exitosamente_`;

        alert("Cita registrada correctamente ✅. Se ha verificado el adelanto del 50%.");

      const whatsappUrl = `https://wa.me/51${ADMIN_NUMBER}?text=${message}`;
      
      window.open(whatsappUrl, "_blank");
      navigate("/");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error reservando turno ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="appointment-container">
      <h2 className="title">Reservar turno</h2>

      <div className="product-summary">
        <p><strong>Servicio:</strong> {producto.nombre}</p>
        <p><strong>Precio Total:</strong> S/ {precioTotal.toFixed(2)}</p>
      </div>

      <form className="appointment-form" onSubmit={handleSubmit}>
        <label className="form-label">
          Usuario:
          <input type="text" value={form.username} className="form-input" readOnly />
        </label>

        <label className="form-label">
          Teléfono:
          <input
            type="tel"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Ej: 987654321"
            className="form-input"
            required
          />
        </label>

        <label className="form-label">
          Fecha:
          <input type="date" name="date" value={form.date} onChange={handleChange} className="form-input" required />
        </label>

        <label className="form-label">
          Hora:
          <select name="time" value={form.time} onChange={handleChange} className="form-input" required>
            <option value="">Seleccione un horario</option>
            {AVAILABLE_HOURS.map((hour) => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
        </label>

        {/* Mensaje Informativo del 50% */}
        <div className="payment-notice" style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '15px', borderRadius: '8px', border: '1px solid #ffeeba', marginBottom: '15px', fontSize: '0.9rem' }}>
          <strong>ℹ️ Información de pago:</strong><br />
          Para confirmar su reserva, debe realizar el pago anticipado del <b>50%</b> del servicio.<br />
          <b>Total a pagar ahora: S/ {precioAdelanto.toFixed(2)}</b> (de S/ {precioTotal.toFixed(2)})
        </div>

        <div className="payment-area">
          <p className="payment-title title-sub">Selecciona tu método de pago</p>
          <div className="btn-group">
            <button 
              type="button" 
              className={`btn-yape ${form.paymentMethod === 'yape' ? 'active' : ''}`} 
              onClick={() => setForm({...form, paymentMethod: 'yape'})}
            >
              Yape
            </button>
            <button 
              type="button" 
              className={`btn-plin ${form.paymentMethod === 'plin' ? 'active' : ''}`} 
              onClick={() => setForm({...form, paymentMethod: 'plin'})}
            >
              Plin
            </button>
          </div>

          {(form.paymentMethod === 'yape' || form.paymentMethod === 'plin') && (
            <div className="qr-section">
              <p className="title-sub">Escanea para pagar <b>S/ {precioAdelanto.toFixed(2)}</b></p>
              <img 
                src={form.paymentMethod === 'yape' ? "/qrs/yape.PNG" : "/qrs/plin.PNG"} 
                alt="QR Pago" 
                className="qr-image"
              />
              <div className="copy-box" onClick={copyNumber} title="Click para copiar">
                <span>{ADMIN_NUMBER}</span> {isCopied ? "✅" : "📋"}
              </div>
              <label className="file-upload title-sub">
                Subir comprobante del adelanto:
                <input 
                  type="file" 
                  accept="image/*" 
                  required 
                  onChange={(e) => setPaymentScreenshot(e.target.files[0])} 
                />
              </label>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={loading || !form.paymentMethod || !paymentScreenshot}
        >
          {loading ? "Procesando..." : "Confirmar Cita"}
        </button>
      </form>
    </section>
  );
}