import React from 'react';
import { useNavigate } from 'react-router-dom';
import { moviesService } from "../../services/api.js";
import './Inicio.css';

export default function Inicio() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [movies, setMovies] = React.useState([]);

  React.useEffect(() => {
    async function fetchMovies() {
      try {
        const results = await moviesService.getPopularMovies();
        setMovies(results);
      } catch (error) {
        console.error("Failed to load movies", error);
      }
    }
    fetchMovies();
  }, []);

  // Carousel auto-slide
  React.useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, [movies]);

  function goToPlayer(movie) {
    if (movie && movie.id) {
      navigate(`/ver/${movie.id}`);
    } else {
      navigate("/ver/strangerthings");
    }
  }

  function goToDetail(movie) {
    if (movie && movie.id) {
      navigate(`/detail/${movie.id}`);
    } else {
      navigate("/detail/strangerthings");
    }
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

  // Helper to get image URL
  const getImageUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : "https://placehold.co/300x420/111111/FFFFFF?text=No+Image";
  };

  return (
    <div className="inicio-page">
      {/* ... header remains same ... */}
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
        <div className="inicio-hero-bg" style={{
          backgroundImage: movies.length > 0 ? `url(https://image.tmdb.org/t/p/original${movies[0].backdrop_path})` : ""
        }}></div>

        <div className="inicio-hero-content">
          <h1>{movies.length > 0 ? movies[0].title : "Prueba"}</h1>
          <p>
            {movies.length > 0 ? (movies[0].overview?.slice(0, 150) + "...") : "Descripcion"}
          </p>

          <div className="inicio-buttons">
            <button
              className="inicio-btn inicio-btn-primary"
              onClick={() => goToPlayer(movies[0])}
            >
              Ver ahora
            </button>

            <button
              className="inicio-btn inicio-btn-secondary"
              onClick={() => goToDetail(movies[0])}
            >
              Más info
            </button>
          </div>
        </div>
      </section>
      {movies.slice(0, 5).map((movie, index) => {
        // Calculate relative index for visual stacking
        // We want the current slide in front, next ones behind
        let offset = index - currentSlide;
        if (offset < 0) offset += movies.length > 5 ? 5 : movies.length;

        // Only show if it's one of the immediate next ones or current
        // Simple stack logic: 
        // 0 (front): scale 1, transX 0, z 10, opacity 1
        // 1 (behind 1): scale 0.9, transX 40px, z 5, opacity 0.8
        // 2 (behind 2): scale 0.8, transX 80px, z 1, opacity 0.6

        // Simplified for this loop: Just simple mapping based on 'index' vs 'currentSlide' logic above is cyclic 
        // Ideally we treat 'currentSlide' as the front one.

        // Let's use simpler logic matching the map index for now if simpler
        // But 'currentSlide' changes. 

        // Fix: Just render the movies shifted by currentSlide visually?
        // Better: Render static list but change classes? 

        // Let's stick to the previous simple logic but improved:
        const isActive = index === currentSlide;
        let style = {};

        if (isActive) {
          style = { transform: 'translateX(0) scale(1)', zIndex: 10, opacity: 1 };
        } else if (index === (currentSlide + 1) % 5) {
          style = { transform: 'translateX(40px) scale(0.9)', zIndex: 5, opacity: 0.7 };
        } else if (index === (currentSlide + 2) % 5) {
          style = { transform: 'translateX(80px) scale(0.8)', zIndex: 1, opacity: 0.4 };
        } else {
          style = { opacity: 0, pointerEvents: 'none' };
        }

        return (
          <div
            key={movie.id}
            className={`carousel-slide ${isActive ? "active" : ""}`}
            style={style}
            onClick={() => goToDetail(movie)}
          >
            <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
          </div>
        );
      })}
    </div>
        </div >
      </section >

    <section className="inicio-section">
      <h2>Tendencias...</h2>

      <div className="inicio-list">
        {movies.slice(1).map((movie) => (
          <div className="inicio-movie" key={movie.id} onClick={() => goToDetail(movie)}>
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
            />
            <div className="inicio-movie-title">{movie.title}</div>
          </div>
        ))}
      </div>
    </section>

    </div >
  );
}