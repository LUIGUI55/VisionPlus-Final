import React from 'react';
import { useNavigate } from 'react-router-dom';
import { moviesService } from "../../services/api.js";

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
    navigate("/buscar");
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

        {/* Carousel Section */}
        <div className="inicio-hero-carousel">
          <div className="carousel-track">
            {movies.slice(0, 5).map((movie, index) => (
              <div
                key={movie.id}
                className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
                style={{
                  transform: index === currentSlide ? 'scale(1.1) translateX(0)' : 'scale(0.9) translateX(20px)',
                  opacity: index === currentSlide ? 1 : 0.6,
                  zIndex: index === currentSlide ? 10 : 1
                }}
                onClick={() => goToDetail(movie)}
              >
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
              </div>
            ))}
          </div>
        </div>
      </section>

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

    </div>
  );
}