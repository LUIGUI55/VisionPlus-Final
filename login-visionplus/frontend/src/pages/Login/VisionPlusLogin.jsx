import React from "react";
import { useNavigate } from "react-router-dom";
import "./VisionPlusLogin.css";
import { authService } from "../../services/api";

export default function VisionPlusLogin({ backgroundUrl = "fondo.jpg" }) {

  const navigate = useNavigate();

  function goDetail(e) {
    e.preventDefault();
    navigate("/inicio");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    try {
      await authService.login(data.email, data.password);
      navigate("/inicio");
    } catch (error) {
      console.error("Login error:", error);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  function goRegister(e) {
    e.preventDefault();
    navigate("/register");
  }

  function goChangePassword(e) {
    e.preventDefault();
    navigate("/changepassword");
  }

  return (
    <div className="login-page">

      <header className="header">
        <div className="brand">VISIONPLUS</div>
      </header>

      <main
        className="hero"
        style={{ "--hero-image": `url('${backgroundUrl}')` }}
      >
        <div className="card">

          <div className="title">
            <div className="icon"></div>
            <h1>Iniciar sesión</h1>
          </div>

          <form className="form" onSubmit={handleSubmit}>

            <div className="field">
              <label htmlFor="email">Correo electrónico o usuario</label>
              <input
                className="input"
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input
                className="input"
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <div className="actions">
              <button className="btn btn-primary" type="submit">
                Iniciar sesión
              </button>

              <a className="link" href="#" onClick={goChangePassword}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div className="bottom">
              <span className="muted" onClick={goRegister} style={{ cursor: "pointer" }}>
                ¿No tienes cuenta?
              </span>

              <label className="checkbox">
                <input type="checkbox" />
                <span>Recordar sesión</span>
              </label>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}