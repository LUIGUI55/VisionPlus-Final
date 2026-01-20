import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await authService.register(email, password);
      // Auto-login or redirect to login
      alert("¡Cuenta creada con éxito! Por favor inicia sesión.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Error al crear cuenta. Intenta de nuevo.");
    }
  };

  return (
    <div className="register-page-body">
      <header className="header">
        <div className="brand">
          VISIONPLUS
        </div>

        <a className="regresar" onClick={() => navigate("/login")}>
          Regresar
        </a>
      </header>

      <div className="contenedor">
        <div className="card">
          <h1>Crear cuenta</h1>

          <form onSubmit={handleSubmit}>
            <input type="text" name="email" placeholder="Correo electrónico o usuario" required />
            <input type="password" name="password" placeholder="Contraseña" required />
            <input type="password" placeholder="Confirmar contraseña" required />

            <button type="submit">Crear Cuenta</button>
          </form>
        </div>
      </div>
    </div>
  );
}