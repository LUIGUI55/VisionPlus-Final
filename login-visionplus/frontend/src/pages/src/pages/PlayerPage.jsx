import React, { useEffect, useMemo, useRef } from "react";
import { moviesService } from "../../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "./PlayerPage.css";

function getVideoById(id) {
  const catalog = {
    strangers2: {
      title: "Prueba",
      poster: " ",
      sources: [{ src: "/videos/strangers2-1080.mp4", type: "video/mp4" }],
    },
    strangerthings: {
      title: "Prueba",
      poster: "",
      sources: [{ src: "/videos/strangerthings.mp4", type: "video/mp4" }],
    },
  };
  return catalog[id] ?? { title: id, sources: [] };
}

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = React.useState(null);
  const videoRef = useRef(null);
  const storageKey = `vp-progress:${id}`;

  React.useEffect(() => {
    if (!id) return;
    const fetchStream = async () => {
      try {
        const data = await moviesService.getStreamUrl(id);
        setVideoData(data);
      } catch (e) {
        console.error("Error fetching stream:", e);
      }
    };
    fetchStream();
  }, [id]);

  useEffect(() => {
    // Solo para video HTML5
    const v = videoRef.current;
    if (!v) return;
    const t = Number(localStorage.getItem(storageKey) || 0);
    const onLoaded = () => {
      if (t && v.duration && t < v.duration - 3) v.currentTime = t;
    };
    v.addEventListener("loadedmetadata", onLoaded);
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, [storageKey, videoData]);

  useEffect(() => {
    // Solo para video HTML5
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
  }, [storageKey, videoData]);

  function goToInicio() { navigate("/inicio"); }
  function goToMiLista() { navigate("/milista"); }
  function goToBusqueda() { navigate("/busqueda"); }
  function goToPerfil() { navigate("/perfil"); }
  function goToNotifications() { navigate("/notificaciones"); }

  if (!videoData) return <div className="watch-main">Cargando player...</div>;

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
          {videoData.type === 'bunny' ? (
            <iframe
              src={`https://iframe.mediadelivery.net/embed/${videoData.libraryId}/${videoData.videoId}?autoplay=true`}
              loading="lazy"
              style={{ border: 0, width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
            ></iframe>
          ) : (
            <video
              ref={videoRef}
              className="video-el"
              controls
              preload="metadata"
              // poster={data.poster}
              playsInline
              autoPlay
            >
              <source src={videoData.url} type={videoData.type === 'hls' ? 'application/x-mpegURL' : 'video/mp4'} />
              Tu navegador no soporta video HTML5.
            </video>
          )}
        </div>
        <button className="inicio-btn inicio-btn-primary" onClick={goToInicio}>
          Regresar
        </button>
      </main>
    </div>
  );
}