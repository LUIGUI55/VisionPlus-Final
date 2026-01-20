import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Cuenta creada con éxito!");
    navigate("/inicio");
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