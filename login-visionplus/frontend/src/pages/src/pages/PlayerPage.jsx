import React, { useEffect, useMemo, useRef, useState } from "react";
import { moviesService, commentsService } from "../../../services/api";
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
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
    };
  }, [storageKey, videoData]);

  // Navigation Functions
  function goToInicio() { navigate("/inicio"); }
  function goToMiLista() { navigate("/milista"); }
  function goToBusqueda() { navigate("/busqueda"); }
  function goToPerfil() { navigate("/perfil"); }
  function goToNotifications() { navigate("/notificaciones"); }

  // --- Logic for Time-Synced Comments ---
  const [comments, setComments] = useState([]);
  const [activeEmojis, setActiveEmojis] = useState([]);

  // 1. Cargar comentarios al iniciar
  useEffect(() => {
    if (!id) return;
    commentsService.getComments(id).then(data => {
      setComments(data);
    }).catch(err => console.error("Error loading comments:", err));
  }, [id]);

  // 2. Sincronizar emojis con el tiempo del video
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      const currentTime = Math.floor(v.currentTime);
      // Filtrar comentarios que coincidan con este segundo exacto
      // y que no estén ya mostrados (para evitar spam visual si el update es muy rápido)
      const matches = comments.filter(c => Math.floor(c.timestamp) === currentTime);

      if (matches.length > 0) {
        // Mostrar emojis por 2 segundos
        setActiveEmojis(prev => {
          // Evitar duplicados simples si ya están
          const newIds = new Set(matches.map(m => m._id));
          const currentIds = new Set(prev.map(p => p._id));
          // Solo agregar si no están en pantalla
          const toAdd = matches.filter(m => !currentIds.has(m._id));

          if (toAdd.length === 0) return prev;
          return [...prev, ...toAdd];
        });

        // Limpiarlos después de 2s
        setTimeout(() => {
          setActiveEmojis(prev => prev.filter(p => !matches.includes(p)));
        }, 2000);
      }
    };

    v.addEventListener("timeupdate", onTimeUpdate);
    return () => v.removeEventListener("timeupdate", onTimeUpdate);
  }, [comments]);

  // 3. Enviar Reacción
  const sendReaction = async (emoji) => {
    const v = videoRef.current;
    const currentTime = v ? v.currentTime : 0;

    // Optimistic Update: Mostrarlo inmediatamente
    const tempId = Date.now();
    const tempComment = { _id: tempId, emoji, timestamp: currentTime };
    setActiveEmojis(prev => [...prev, tempComment]);
    setTimeout(() => setActiveEmojis(prev => prev.filter(p => p._id !== tempId)), 2000);

    try {
      await commentsService.addComment(id, "", emoji, currentTime);
      // Recargar comentarios (opcional, o solo agregarlo al state local)
      setComments(prev => [...prev, { ...tempComment, _id: "server-" + tempId }]);
      console.log("Reacción enviada!");
    } catch (error) {
      console.error("Error enviando reacción:", error);
    }
  };

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

          {/* Emoji Overlay */}
          <div className="emoji-overlay">
            {activeEmojis.map(c => (
              <div key={c._id} className="emoji-float" style={{ left: `${Math.random() * 80 + 10}%` }}>
                {c.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Reaction Bar */}
        <div className="reaction-bar">
          <span>Reacciona en este momento:</span>
          <button onClick={() => sendReaction("🔥")}>🔥</button>
          <button onClick={() => sendReaction("❤️")}>❤️</button>
          <button onClick={() => sendReaction("😂")}>😂</button>
          <button onClick={() => sendReaction("😮")}>😮</button>
          <button onClick={() => sendReaction("😢")}>😢</button>
        </div>

        <button className="inicio-btn inicio-btn-primary" onClick={goToInicio}>
          Regresar
        </button>
      </main>
    </div>
  );
}