import React from "react";
import { useNavigate } from "react-router-dom";
import "./Inicio.css";
import { moviesService } from "../../services/api";

export default function Inicio() {
  const navigate = useNavigate();
  const [movies, setMovies] = React.useState([]);

  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Intentar obtener películas populares de TMDB
        const popularData = await moviesService.getPopularMovies();

        if (Array.isArray(popularData) && popularData.length > 0) {
          // Mapear datos de TMDB al formato que espera nuestro UI si es necesario
          // (En este caso, TMDB devuelve title, poster_path, id, etc. que es compatible)
          // Aseguramos que tengan tmdbId (que es el id en TMDB)
          const formatted = popularData.map(m => ({
            ...m,
            tmdbId: m.id // TMDB usa 'id', nuestro sistema mapeado usa 'tmdbId'
          }));
          setMovies(formatted);
        } else {
          // Fallback a videos mapeados si popular falla o está vacío
          console.log("No popular movies found, trying mapped videos...");
          const mappedData = await moviesService.getMappedMovies();
          if (Array.isArray(mappedData)) setMovies(mappedData);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        // Fallback final silencioso
      }
    };
    fetchMovies();
  }, []);

  function goToPlayer(id) {
    if (id) navigate(`/ver/${id}`);
    else if (movies.length > 0) navigate(`/ver/${movies[0].tmdbId}`);
  }

  function goToDetail(id) {
    if (id) navigate(`/detail/${id}`);
    else if (movies.length > 0) navigate(`/detail/${movies[0].tmdbId}`);
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
          <h1>{movies.length > 0 ? movies[0].title : "Cargando..."}</h1>
          <p>
            {movies.length > 0 ? "Disfruta de nuestro contenido exclusivo." : "..."}
          </p>

          <div className="inicio-buttons">
            <button
              className="inicio-btn inicio-btn-primary"
              onClick={() => goToPlayer(movies[0]?.tmdbId)}
            >
              Ver ahora
            </button>

            <button
              className="inicio-btn inicio-btn-secondary"
              onClick={() => goToDetail(movies[0]?.tmdbId)}
            >
              Más info
            </button>
          </div>
        </div>
      </section>

      <section className="inicio-section">
        <h2>Tendencias...</h2>

        <div className="inicio-list">
          {Array.isArray(movies) && movies.map((movie) => (
            <div className="inicio-movie" key={movie._id} onClick={() => goToDetail(movie.tmdbId)} style={{ cursor: 'pointer' }}>
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : (movie.posterPath ? `https://image.tmdb.org/t/p/w300${movie.posterPath}` : "https://placehold.co/300x420/111111/FFFFFF?text=No+Poster")}
                alt={movie.title}
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x420/111111/FFFFFF?text=No+Poster" }}
              />
              <div className="inicio-movie-title">{movie.title}</div>
            </div>
          ))}
          {movies.length === 0 && <p>No hay videos disponibles por el momento.</p>}
        </div>
      </section>

    </div>
  );
}