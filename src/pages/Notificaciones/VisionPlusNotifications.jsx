import React from "react";
import { useNavigate } from "react-router-dom";
import "./VisionPlusNotifications.css";

const SearchButtonIcon = () => (
    <span role="img" aria-label="lupa">🔍</span>
);

export default function VisionPlusNotifications() {
  const navigate = useNavigate();
  const onSearch = (e) => e.preventDefault();

  function goToBusqueda() {
    navigate("/busqueda");
  }
  function goToPerfil() {
    navigate("/perfil");
  }
  function goToHome() {
    navigate("/inicio");
  }
  
  function goToMiLista() { 
    navigate("/milista");
  }
  function goToNotifications() { 
    navigate("/notificaciones");
  }

  return (
    <div className="vpnotif-page">

      <header className="perfil-topbar">
        <div className="perfil-brand brand">VISIONPLUS</div>

        <nav className="perfil-nav">
      
          <a onClick={goToHome}> 
            Inicio
          </a>
          <a onClick={goToMiLista}> 
            Mi lista
          </a>
        </nav>

        <div className="perfil-search-box" onClick={goToBusqueda}>
          <input
            type="text"
            placeholder="Buscar..."
            onFocus={goToBusqueda}
            readOnly
          />
          <button>
            <SearchButtonIcon /> 
          </button>
        </div>

        <div className="perfil-user right">
          <div onClick={goToPerfil} style={{ cursor: "pointer" }}>
            Perfil
          </div>

          <div className="active" onClick={goToNotifications} style={{ cursor: "pointer" }}> 
            Notificaciones
          </div>
        </div>
      </header>

      <main className="vpnotif-wrap">
        <div className="vpnotif-section-head">
          <h2>Notificaciones</h2>
          <div className="vpnotif-hr"></div>
        </div>

        <section className="vpnotif-timeline">

          <div className="vpnotif-group">
            <div className="vpnotif-date">15 de Septiembre 2025</div>

            <div className="vpnotif-item">
              <div className="vpnotif-msg">Su plan fue realizado exitosamente</div>
              <div className="vpnotif-time">11:20 a.m</div>
            </div>

            <div className="vpnotif-item">
              <div className="vpnotif-msg">Stranger Things se ha agregado a “Mi lista”</div>
              <div className="vpnotif-time">7:25 p.m</div>
            </div>
          </div>

          <div className="vpnotif-group">
            <div className="vpnotif-date">10 de Octubre 2025</div>

            <div className="vpnotif-item">
              <div className="vpnotif-msg">Su plan está a punto de vencer</div>
              <div className="vpnotif-time">11:00 a.m</div>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}