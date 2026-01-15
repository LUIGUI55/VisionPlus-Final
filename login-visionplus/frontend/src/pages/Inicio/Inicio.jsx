import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config";
import "./Inicio.css";

export default function Inicio() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovies() {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Get List of Mapped Videos
        const res = await fetch(`${API_URL}/videos/mapped`, { headers });
        if (!res.ok) throw new Error("Failed to load mapped videos");
        const mappedData = await res.json();

        // 2. Enrich with TMDB Data
        // We use Promise.allSettled to avoid failing everything if one TMDB lookup fails
        const enrichedPromises = mappedData.map(async (vid) => {
          try {
            const tmdbRes = await fetch(`${API_URL}/movies/${vid.tmdbId}`, { headers });
            if (tmdbRes.ok) {
              const tmdbData = await tmdbRes.json();
              return { ...vid, poster_path: tmdbData.poster_path, overview: tmdbData.overview };
            }
            return vid;
          } catch (e) {
            return vid;
          }
        });

        const results = await Promise.all(enrichedPromises);
        setMovies(results);

      } catch (error) {
        console.error("Error loading billboard:", error);
      }
    }

    fetchMovies();
  }, []);


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
        <h2>Mi Cartelera</h2>

        <div className="inicio-list">
          {movies.length === 0 ? (
            <div className="text-white ml-4">No hay películas agregadas aún.</div>
          ) : (
            movies.map((movie, index) => (
              <div
                className="inicio-movie"
                key={movie.tmdbId || index}
                onClick={() => navigate(`/detail/${movie.tmdbId}`)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : `https://placehold.co/300x420/111111/FFFFFF?text=${encodeURIComponent(movie.title || "Video")}`}
                  alt={movie.title}
                />
                <div className="inicio-movie-title">{movie.title}</div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
