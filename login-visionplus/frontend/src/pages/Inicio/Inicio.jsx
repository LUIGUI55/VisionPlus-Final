import React from "react";
import { useNavigate } from "react-router-dom";
import "./Inicio.css";

export default function Inicio() {

  const navigate = useNavigate();


  function goToPlayer() {
    navigate("/ver/550");
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

      { }
      <header className="inicio-navbar">
        <div className="inicio-logo">
          VISIONPLUS
        </div>

        <nav className="inicio-nav">
          <a className="active">Inicio</a>
          <a onClick={goToMiLista} style={{ cursor: "pointer" }}>Mi lista</a>
        </nav>

        { }
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

      { }
      <section className="inicio-hero">
        <div className="inicio-hero-bg"></div>

        <div className="inicio-hero-content">
          <h1>Stranger Things (Demo Fight Club)</h1>
          <p>
            Cuando un niño desaparece, sus amigos, la familia y la policía
            se ven envueltos en un misterio con fuerzas sobrenaturales.
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

      { }
      <section className="inicio-section">
        <h2>Demos disponibles</h2>

        <div className="inicio-list">
          {[
            { id: 550, title: "Fight Club (Demo)" },
            { id: 680, title: "Pulp Fiction (Demo)" },
            { id: 278, title: "Shawshank (Demo)" },
            { id: 999, title: "Sintel (Default)" },
            { id: 101, title: "Venom" },
            { id: 102, title: "Monsters of War" }
          ].map((movie, index) => (
            <div
              className="inicio-movie"
              key={index}
              onClick={() => navigate(`/ver/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={`https://placehold.co/300x420/111111/FFFFFF?text=${encodeURIComponent(movie.title)}`}
                alt={movie.title}
              />
              <div className="inicio-movie-title">{movie.title}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
