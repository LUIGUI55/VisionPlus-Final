import { moviesService } from "../../services/api.js";

export default function Inicio() {
  const navigate = useNavigate();
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
  // ... keep existing navigation functions ...

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
            {movies.length > 0 ? movies[0].overview : "Descripcion"}
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