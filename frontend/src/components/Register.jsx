import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 

    if (Number(age) <= 0) {
      setLoading(false);
      setError("La edad debe ser un número positivo.");
      return;
    }

    try {
      
      const response = await axios.post("http://localhost:3000/api/users/register", {
        username,
        password,
        email,
        age: Number(age), 
      });

      if (response.status === 201) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Error al registrarse");
      } else {
        setError("Error al registrar. Intenta nuevamente más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Edad"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Cargando..." : "Registrarse"}
      </button>
    </form>
  );
}

export default Register;






