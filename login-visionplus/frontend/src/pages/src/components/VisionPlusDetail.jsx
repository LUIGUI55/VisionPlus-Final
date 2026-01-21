import { useParams, useNavigate } from "react-router-dom";
import { moviesService, listsService } from "../../../services/api.js";
import { useEffect, useState } from "react";

export default function VisionPlusDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);

    async function fetchDetail() {
      try {
        if (id === 'strangerthings') {
          // allow fallback static or redirect
        }
        const data = await moviesService.getVideoDetails(id);
        setMovie(data);

        // Check if favorite
        if (storedUser) {
          const userId = storedUser._id || storedUser.id;
          const isFav = await listsService.checkFavorite(userId, id);
          setIsFavorite(isFav);
        }
      } catch (e) {
        console.error("Failed to load movie detail", e);
      }
    }
    fetchDetail();
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) return alert("Inicia sesión para agregar a favoritos");
    const userId = user._id || user.id;

    try {
      if (isFavorite) {
        await listsService.removeFromFavorites(userId, movie.id);
        setIsFavorite(false);
      } else {
        await listsService.addToFavorites(userId, movie.id, movie);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favorites", error);
      alert("No se pudo actualizar la lista");
    }
  };

  if (!movie) return <div style={{ color: 'white', padding: '20px' }}>Cargando...</div>;

  return (
    <>

      <header className="inicio-navbar header">
        <div className="inicio-logo brand">
          VISIONPLUS
        </div>

        <nav className="inicio-nav">
          <a className="active">Inicio</a>
          <a onClick={() => navigate("/MiLista")} style={{ cursor: "pointer" }}>Mi lista</a>
        </nav>

        <div className="inicio-search-box" onClick={() => navigate("/busqueda")}>
          <input
            type="text"
            placeholder="Buscar..."
            onFocus={() => navigate("/busqueda")}
            readOnly
          />
          <button>🔍</button>
        </div>

        <div className="inicio-user">
          <div onClick={() => navigate("/perfil")} style={{ cursor: "pointer" }}>
            Perfil
          </div>
          <div onClick={() => navigate("/notificaciones")} style={{ cursor: "pointer" }}>
            Notificaciones
          </div>
        </div>
      </header>

      <main className="wrap">
        <div className="grid">
          { }
          <aside className="left">
            <figure className="poster">
              <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://placehold.co/300x450"} alt={movie.title} />
            </figure>
            <div className="actions">
              <button className="act-btn" style={{ backgroundColor: '#9d4edd', color: 'white', marginRight: '10px' }} onClick={() => navigate(`/ver/${id}`)}>▶ Ver ahora</button>
              <button className="act-btn" onClick={toggleFavorite}>
                {isFavorite ? "✔️ En mi lista" : "➕ Agregar a…"} <small>Mi lista</small>
              </button>
            </div>
          </aside>


          <section>
            <header className="panel detail-hero">
              <div className="bg" style={{ backgroundImage: movie.backdrop_path ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` : "" }}></div>
              <div className="title">
                <h1>{movie.title}</h1><span className="year">({new Date(movie.release_date).getFullYear() || "2025"})</span>
              </div>
              <div className="meta-row">
                <span className="rating"><span className="dot"></span> {movie.vote_average ?? "0"} • HD</span>
                <span className="pill">Película</span>
              </div>
              <p className="syn">{movie.overview}</p>
            </header>



            <div className="player" onClick={() => navigate(`/ver/${id}`)}>
              <div className="ph"></div>
            </div>

            <section className="features">
            </section>



          </section>

          { }
          <aside className="aside">
            <div className="panel list">
              <div className="tabs">
                <button className="tab active">Actualizado</button>
                <button className="tab">Últimas</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}