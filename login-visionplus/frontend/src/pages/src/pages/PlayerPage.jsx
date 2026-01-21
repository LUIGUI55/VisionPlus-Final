import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { moviesService } from "../../../services/api.js";
import "./PlayerPage.css";

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const storageKey = `vp-progress:${id}`;

  useEffect(() => {
    async function loadVideo() {
      try {
        const details = await moviesService.getVideoDetails(id);
        const stream = await moviesService.getStreamUrl(id);

        setVideoData({
          title: details.title || stream.title || "Película",
          overview: details.overview || "",
          poster: details.poster_path ? `https://image.tmdb.org/t/p/original${details.poster_path}` : "",
          source: stream.url
        });
      } catch (error) {
        console.error("Error loading video:", error);
        setVideoData({
          title: "Video No Disponible",
          overview: "Lo sentimos, no pudimos cargar la información de esta película.",
          poster: "",
          source: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        });
      }
    }
    loadVideo();
  }, [id]);

  useEffect(() => {
    if (!videoData || !videoRef.current) return;

    const video = videoRef.current;
    const src = videoData.source;

    // 1. Try Native HLS (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
    // 2. Try Hls.js (Chrome, Firefox, Edge)
    else if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else {
      console.error("HLS resolution not supported");
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoData]);

  // Save progress logic remains same
  useEffect(() => {
    if (!videoData) return;
    const v = videoRef.current;
    if (!v) return;

    const t = Number(localStorage.getItem(storageKey) || 0);
    const onLoaded = () => {
      // Only set time if video is long enough
      if (t > 0 && v.duration && t < v.duration - 3) v.currentTime = t;
    };
    v.addEventListener("loadedmetadata", onLoaded);
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, [videoData, storageKey]);

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

  function goToInicio() { navigate("/inicio"); }
  function goToMiLista() { navigate("/milista"); }
  function goToBusqueda() { navigate("/busqueda"); }
  function goToPerfil() { navigate("/perfil"); }
  function goToNotifications() { navigate("/notificaciones"); }

  if (!videoData) return <div style={{ color: 'white' }}>Cargando...</div>;

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
        {videoData.overview && <p className="watch-description" style={{ color: '#ccc', maxWidth: '800px', margin: '0 auto 20px', lineHeight: '1.5' }}>{videoData.overview}</p>}
        <div className="watch__panel">
          <video
            ref={videoRef}
            className="video-el"
            controls
            preload="metadata"
            poster={videoData.poster}
            playsInline
          />
        </div>
        <button className="inicio-btn inicio-btn-primary" onClick={goToInicio}>
          Regresar
        </button>
      </main>
    </div>
  );
}