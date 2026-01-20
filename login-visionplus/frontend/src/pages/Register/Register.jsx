import React from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { authService } from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const confirmPassword = e.target[2].value;

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await authService.register(email, password);
      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      alert("Error al registrar cuenta.");
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
            <input type="text" placeholder="Correo electrónico o usuario" required />
            <input type="password" placeholder="Contraseña" required />
            <input type="password" placeholder="Confirmar contraseña" required />

            <button type="submit">Crear Cuenta</button>
          </form>
        </div>
      </div>
    </div>
  );
}