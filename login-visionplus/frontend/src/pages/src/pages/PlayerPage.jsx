import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { moviesService } from "../../../services/api.js";
import "./PlayerPage.css";

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const videoRef = useRef(null);
  const storageKey = `vp-progress:${id}`;

  // 1. Fetch Video Data
  useEffect(() => {
    async function loadVideo() {
      try {
        const details = await moviesService.getVideoDetails(id);
        const stream = await moviesService.getStreamUrl(id);

        setVideoData({
          title: details.title || "Película",
          poster: details.poster_path ? `https://image.tmdb.org/t/p/original${details.poster_path}` : "",
          sources: [{ src: stream.url, type: "application/x-mpegURL" }]
        });
      } catch (error) {
        console.error("Error loading video:", error);
        // Fallback demo
        setVideoData({
          title: "Error / Demo Mode",
          poster: "",
          sources: [{ src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", type: "application/x-mpegURL" }]
        });
      }
    }
    loadVideo();
  }, [id]);

  // 2. Restore playback position
  useEffect(() => {
    if (!videoData) return;
    const v = videoRef.current;
    if (!v) return;

    const t = Number(localStorage.getItem(storageKey) || 0);
    const onLoaded = () => {
      if (t && v.duration && t < v.duration - 3) v.currentTime = t;
    };
    v.addEventListener("loadedmetadata", onLoaded);
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, [videoData, storageKey]);

  // 3. Save playback position
  useEffect(() => {
    if (!videoData) return;
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => localStorage.setItem(storageKey, String(v.currentTime));
    const onEnded = () => localStorage.removeItem(storageKey);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
    };
  }, [videoData, storageKey]);

  // Navigation
  function goToInicio() { navigate("/inicio"); }
  function goToMiLista() { navigate("/milista"); }
  function goToBusqueda() { navigate("/busqueda"); }
  function goToPerfil() { navigate("/perfil"); }
  function goToNotifications() { navigate("/notificaciones"); }

  if (!videoData) {
    return <div style={{ color: "white", padding: "2rem", textAlign: "center" }}>Cargando video...</div>;
  }

  return (
    <div className="inicio-page">
      <header className="inicio-navbar">
        <div className="inicio-logo brand">VISIONPLUS</div>

        <nav className="inicio-nav">
          <a onClick={goToInicio}>Inicio</a>
          <a onClick={goToMiLista}>Mi lista</a>
        </nav>

        <div className="inicio-search-box" onClick={goToBusqueda}>
          <input type="text" placeholder="Buscar..." readOnly />
          <button>🔍</button>
        </div>

        <div className="inicio-user">
          <div onClick={goToPerfil}>Perfil</div>
          <div onClick={goToNotifications}>Notificaciones</div>
        </div>
      </header>

      <main className="watch-main">
        <h1 className="watch-title">{videoData.title}</h1>
        <div className="watch__panel">
          <video
            ref={videoRef}
            className="video-el"
            controls
            preload="metadata"
            poster={videoData.poster}
            playsInline
          >
            {videoData.sources.map((s, i) => (
              <source key={i} src={s.src} type={s.type} />
            ))}
            Tu navegador no soporta video HTML5.
          </video>
        </div>
        <button className="inicio-btn inicio-btn-primary" onClick={goToInicio}>
          Regresar
        </button>
      </main>
    </div>
  );
}