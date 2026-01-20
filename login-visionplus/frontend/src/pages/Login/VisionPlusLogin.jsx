import React from "react";
import { useNavigate } from "react-router-dom";
import "./VisionPlusLogin.css";
import { authService } from "../../services/api";

export default function VisionPlusLogin({ backgroundUrl = "fondo.jpg" }) {

  const [showPassword, setShowPassword] = React.useState(false);
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
              <div className="password-wrapper">
                <input
                  className="input"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
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