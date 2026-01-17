import React from "react";
import { useNavigate } from "react-router-dom";
import "./VisionPlusChangePassword.css";

export default function VisionPlusChangePassword() {
  const navigate = useNavigate();

  function goToBusqueda() {
    navigate("/busqueda");
  }
  function goToPerfil() {
    navigate("/perfil");
  }
  function goToNotifications() {
    navigate("/notificaciones");
  }
  function goToInicio() {
    navigate("/inicio");
  }
  function goToMiLista() {
    navigate("/milista");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log("Datos enviados:", data);
  };

  return (
    <div className="chp-page">
      <header className="chp-topbar">
        <div className="chp-brand brand">VISIONPLUS</div>

        <nav className="chp-nav">
          <a onClick={goToInicio} style={{ cursor: "pointer" }}>
            Inicio
          </a>
          <a onClick={goToMiLista} style={{ cursor: "pointer" }}>
            Mi lista
          </a>
        </nav>

        <div className="chp-search-box" onClick={goToBusqueda}>
          <input
            type="text"
            placeholder="Buscar..."
            onFocus={goToBusqueda}
            readOnly
          />
          <button aria-label="Buscar">🔍</button>
        </div>

        <div className="chp-user right">
          <div
            className="active"
            onClick={goToPerfil}
            style={{ cursor: "pointer" }}
          >
            Perfil
          </div>
          <div onClick={goToNotifications} style={{ cursor: "pointer" }}>
            Notificaciones
          </div>
        </div>
      </header>

      <main className="chp-wrap">
        <div className="chp-section-head">
          <h2>Cambiar Contraseña</h2>
          <div className="chp-hr"></div>
        </div>

        <div className="chp-inner">
          <div className="chp-avatar">
            <svg className="chp-icon" viewBox="0 0 64 64">
              <circle cx="32" cy="24" r="10" />
              <path d="M12,54 Q32,40 52,54" strokeLinecap="round" />
            </svg>
          </div>

          <form className="chp-form-card" onSubmit={handleSubmit}>
            <div className="chp-field">
              <label className="chp-label" htmlFor="old">
                Ingresar contraseña anterior
              </label>
              <input
                className="chp-input"
                id="old"
                name="old"
                type="password"
                required
              />
            </div>

            <div className="chp-field">
              <label className="chp-label" htmlFor="new">
                Ingrese nueva contraseña
              </label>
              <input
                className="chp-input"
                id="new"
                name="new"
                type="password"
                required
              />
            </div>

            <div className="chp-field">
              <label className="chp-label" htmlFor="confirm">
                Confirme nueva contraseña
              </label>
              <input
                className="chp-input"
                id="confirm"
                name="confirm"
                type="password"
                required
              />
            </div>

            <div className="chp-actions-row">
              <button className="chp-btn-primary" type="submit">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
