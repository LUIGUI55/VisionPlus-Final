import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VisionPlusPlan.css";

export default function VisionPlusPlan() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const hasSession = () => {
    const token = localStorage.getItem("token"); 
    return Boolean(token);
  };

  const handleSelect = (plan) => {
    navigate(`/pago/${plan}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busqueda?q=${searchTerm}`);
    }
  };

  const goToPerfil = () => navigate("/perfil");
  const goToNotifications = () => navigate("/notificaciones");
  const goBack = () => navigate("/");
  const goToMiLista = (e) => {
    e.preventDefault();

    if (!hasSession()) {
      navigate("/");
      return;
    }

    const ok = window.confirm(
      "Ya tienes una sesión iniciada. ¿Deseas ir a Mi Lista?"
    );
    if (ok) navigate("/milista");
  };
  const goToMiPlan = (e) => {
    e.preventDefault();
  };

  return (
    <div className="vpp-body">
      <header className="inicio-navbar">
        <div
          className="inicio-logo brand"
          onClick={() => navigate("/inicio")}
          style={{ cursor: "pointer" }}
        >
          VISIONPLUS
        </div>

        <nav className="inicio-nav">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/inicio");
            }}
          >
            Inicio
          </a>

          {}
          <a href="#" className="active" onClick={goToMiPlan}>
            Mi Plan
          </a>

          {}
          <a href="#" onClick={goToMiLista} style={{ cursor: "pointer" }}>
            Mi Lista
          </a>
        </nav>

        <form className="inicio-search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="inicio-user">
          <div onClick={goToPerfil} style={{ cursor: "pointer" }}>
            Perfil
          </div>
          <div onClick={goToNotifications} style={{ cursor: "pointer" }}>
            Notificaciones
          </div>
        </div>
      </header>

      <main className="vpp-wrap">
        <div className="vpp-section-head">
          <h2>Mi Plan</h2>
          <div className="vpp-hr"></div>
        </div>

        <section className="vpp-pricing">
          {}
          <article className="vpp-card">
            <header>
              <div className="icon">📱</div>
              <h3>Plan FREE</h3>
              <p className="vpp-price">$99</p>
            </header>
            <ul className="vpp-features">
              <li>1 dispositivo</li>
              <li>Catálogo limitado</li>
              <li>Publicidad</li>
              <li>Calidad HD</li>
              <li>Soporte estándar</li>
            </ul>
            <div className="vpp-card-footer">
              <button
                className="vpp-btn-select"
                onClick={() => handleSelect("FREE")}
              >
                Seleccionar Plan
              </button>
            </div>
          </article>

          {}
          <article className="vpp-card">
            <header>
              <div className="icon">📱</div>
              <h3>Plan PREMIUM</h3>
              <p className="vpp-price">$120</p>
            </header>
            <ul className="vpp-features">
              <li>2 dispositivos</li>
              <li>Todo el catálogo</li>
              <li>Sin publicidad</li>
              <li>Full HD / 4K</li>
              <li>Descargas offline</li>
            </ul>
            <div className="vpp-card-footer">
              <button
                className="vpp-btn-select"
                onClick={() => handleSelect("PREMIUM")}
              >
                Seleccionar Plan
              </button>
            </div>
          </article>

          {}
          <article className="vpp-card">
            <header>
              <div className="icon">📱</div>
              <h3>Plan FAMILY</h3>
              <p className="vpp-price">$150</p>
            </header>
            <ul className="vpp-features">
              <li>Hasta 4 dispositivos</li>
              <li>Todo el catálogo</li>
              <li>Perfiles infantiles</li>
              <li>4K / HDR</li>
              <li>Soporte prioritario</li>
            </ul>
            <div className="vpp-card-footer">
              <button
                className="vpp-btn-select"
                onClick={() => handleSelect("FAMILY")}
              >
                Seleccionar Plan
              </button>
            </div>
          </article>
        </section>

        <p className="vpp-note">Su plan reciente es de ….</p>

        <button className="vpp-back-btn" onClick={goBack}>
          ← Atrás
        </button>
      </main>
    </div>
  );
}
