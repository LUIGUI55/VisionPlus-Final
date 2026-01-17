import React from "react";
import { useNavigate } from "react-router-dom";
import "./Inicio.css";

export default function Inicio() {
  const navigate = useNavigate();

  function goToPlayer() {
    navigate("/ver/strangerthings");
  }

  function goToDetail() {
    navigate("/detail/strangerthings");
  }

  function goToMiLista() {
    navigate("/milista");
  }

  function goToBusqueda() {
    navigate("/busqueda");
  }

  function goToPerfil() {
    navigate("/perfil");
  }

  function goToNotifications() {
    navigate("/notificaciones");
  }

  return (
    <div className="inicio-page">

      <header className="inicio-navbar header">
        <div className="inicio-logo brand">
          VISIONPLUS
        </div>

        <nav className="inicio-nav">
          <a className="active">Inicio</a>
          <a onClick={goToMiLista} style={{ cursor: "pointer" }}>Mi lista</a>
        </nav>

        <div className="inicio-search-box" onClick={goToBusqueda}>
          <input
            type="text"
            placeholder="Buscar..."
            onFocus={goToBusqueda}
            readOnly
          />
          <button>🔍</button>
        </div>

        <div className="inicio-user">
          <div onClick={goToPerfil} style={{ cursor: "pointer" }}>
            Perfil
          </div>
          <div onClick={goToNotifications} style={{ cursor: "pointer" }}>
            Notificaciones
          </div>
        </div>
      </header>

      <section className="inicio-hero">
        <div className="inicio-hero-bg"></div>

        <div className="inicio-hero-content">
          <h1>Prueba</h1>
          <p>
            Descripcion
          </p>

          <div className="inicio-buttons">
            <button
              className="inicio-btn inicio-btn-primary"
              onClick={goToPlayer}
            >
              Ver ahora
            </button>

            <button
              className="inicio-btn inicio-btn-secondary"
              onClick={goToDetail}
            >
              Más info
            </button>
          </div>
        </div>
      </section>

      <section className="inicio-section">
        <h2>Tendencias...</h2>

        <div className="inicio-list">
          {[
            "Venom","Monsters of War","E.T.","Cazador de Monstruos",
            "Jupiter Ascending","Troll","TUA","The Strangers"
          ].map((title, index) => (
            <div className="inicio-movie" key={index}>
              <img
                src="https://placehold.co/300x420/111111/FFFFFF?text=Poster"
                alt={title}
              />
              <div className="inicio-movie-title">{title}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}