import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VisionPlusNeon.css";
import { moviesService } from "../../services/api";

export default function VisionPlusNeon() {
  const [email, setEmail] = useState("");
  const [movies, setMovies] = useState([]);
  const [currentPoster, setCurrentPoster] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar películas populares para el carrusel
    moviesService.getPopularMovies().then(data => {
      // Filtrar solo las que tengan poster
      const withPosters = data.filter(m => m.poster_path);
      setMovies(withPosters.slice(0, 10)); // Tomar 10 para rotar
    }).catch(err => console.error("Error loading carousel movies:", err));
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentPoster(prev => (prev + 1) % movies.length);
    }, 2000); // Rotar cada 2 segundos
    return () => clearInterval(interval);
  }, [movies]);


  function handleSubmit(e) {
    e.preventDefault();
    if (email) {
      navigate("/register", { state: { email } });
    }
  }

  function handlePlans() {
    navigate("/planes");
  }

  function goLogin(e) {
    e.preventDefault();
    navigate("/login");
  }

  return (
    <div className="container">
      <header className="header" aria-label="Cabecera">
        <div className="brand">VISIONPLUS</div>

        <nav className="nav" aria-label="acciones">
          <a href="/login" onClick={goLogin} aria-label="Iniciar sesión">
            Iniciar Sesión
          </a>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-inner">
          <section className="copy">
            <h1>
              Disfruta tus <span className="hl">películas</span> favoritas sin{" "}
              <span className="hl">límites</span>
            </h1>

            <p className="sub">
              Todo el cine, series y documentales en un solo lugar.
            </p>

            <div className="actions-row">
              <button
                className="btn btn-ghost"
                type="button"
                onClick={handlePlans}
              >
                Ver planes
              </button>
            </div>
          </section>

          {/* Carrusel de Posters */}
          <section className="carousel-Column">
            {movies.length > 0 && (
              <div className="poster-carousel">
                {movies.map((movie, index) => (
                  <img
                    key={movie.id}
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className={`carousel-img ${index === currentPoster ? "active" : ""}`}
                  />
                ))}
                <div className="carousel-overlay"></div>
              </div>
            )}
          </section>
        </div>

        <div className="spacer" />
      </main>
    </div>
  );
}