import React, { useState } from "react";
import { moviesService } from "../../services/api";
import "./AddVideo.css";
import { useNavigate } from "react-router-dom";

export default function AddVideo() {
    const navigate = useNavigate();
    // State for security
    const [secret, setSecret] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [unlockError, setUnlockError] = useState(false);

    // Form State
    const [tmdbId, setTmdbId] = useState("");
    const [bunnyId, setBunnyId] = useState("");
    const [movieData, setMovieData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", msg: "" });

    const handleUnlock = (e) => {
        e.preventDefault();
        // Simple client-side check for UX, real check is on backend
        if (secret === "visionplus_admin") {
            setIsUnlocked(true);
            setUnlockError(false);
        } else {
            setUnlockError(true);
            setTimeout(() => setUnlockError(false), 2000);
        }
    };

    const fetchTmdbDetails = async () => {
        if (!tmdbId) return;
        setLoading(true);
        setStatus({ type: "", msg: "" });
        try {
            const data = await moviesService.getVideoDetails(tmdbId);
            if (data) {
                setMovieData({
                    title: data.title || data.name,
                    poster: data.poster_path, // TMDB format
                    overview: data.overview
                });
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: "error", msg: "No se encontró ID en TMDB" });
            setMovieData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleMapVideo = async () => {
        if (!tmdbId || !bunnyId || !movieData) {
            setStatus({ type: "error", msg: "Faltan datos requeridos" });
            return;
        }

        setLoading(true);
        try {
            await moviesService.mapVideo({
                tmdbId: parseInt(tmdbId),
                bunnyVideoId: bunnyId,
                title: movieData.title,
                type: 'movie' // Default to movie for now
            }, secret);

            setStatus({ type: "success", msg: "¡Película agregada correctamente!" });
            // Reset form
            setTmdbId("");
            setBunnyId("");
            setMovieData(null);
        } catch (error) {
            console.error(error);
            setStatus({ type: "error", msg: "Error al mapear (Revisa el código secreto)" });
        } finally {
            setLoading(false);
        }
    };

    if (!isUnlocked) {
        return (
            <div className="add-video-page">
                <div className="admin-lock-screen">
                    <div className="lock-card">
                        <span className="lock-icon">🔒</span>
                        <h2>Acceso Restringido</h2>
                        <p style={{ color: '#aaa', marginBottom: '20px' }}>
                            Introduce el código de administrador
                        </p>
                        <form onSubmit={handleUnlock}>
                            <input
                                type="password"
                                className="lock-input"
                                placeholder="Código Secreto"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className="admin-btn btn-primary">
                                Desbloquear
                            </button>
                        </form>
                        {unlockError && (
                            <p style={{ color: '#ef4444', marginTop: '15px' }}>Código incorrecto</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="add-video-page">
            <div className="admin-container">
                <header className="admin-header">
                    <h1>Panel de Administración</h1>
                    <p style={{ color: '#9aa3b2' }}>Sube y conecta nuevas películas a VisionPlus</p>
                </header>

                <div className="admin-card">
                    {status.msg && (
                        <div className={`status-message ${status.type === 'success' ? 'status-success' : 'status-error'}`}>
                            {status.msg}
                        </div>
                    )}

                    <div className="form-group">
                        <label>1. Buscar en TMDB</label>
                        <div className="input-with-action">
                            <input
                                type="number"
                                className="admin-input"
                                placeholder="Ej: 550 (Fight Club)"
                                value={tmdbId}
                                onChange={(e) => setTmdbId(e.target.value)}
                            />
                            <button
                                className="admin-btn btn-secondary"
                                onClick={fetchTmdbDetails}
                                disabled={loading || !tmdbId}
                            >
                                {loading ? "Buscando..." : "Buscar Datos"}
                            </button>
                        </div>
                    </div>

                    {movieData && (
                        <div className="movie-preview">
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movieData.poster}`}
                                alt="Poster"
                                className="preview-poster"
                            />
                            <div className="preview-info">
                                <h3>{movieData.title}</h3>
                                <p>{movieData.overview ? movieData.overview.substring(0, 100) + "..." : "Sin descripción"}</p>
                            </div>
                        </div>
                    )}

                    <div className="form-group" style={{ marginTop: '25px' }}>
                        <label>2. ID de Bunny.net</label>
                        <input
                            type="text"
                            className="admin-input"
                            placeholder="Ej: 98d7f8d7-..."
                            value={bunnyId}
                            onChange={(e) => setBunnyId(e.target.value)}
                        />
                    </div>

                    <button
                        className="admin-btn btn-primary"
                        style={{ marginTop: '20px' }}
                        onClick={handleMapVideo}
                        disabled={loading || !movieData || !bunnyId}
                    >
                        {loading ? "Procesando..." : "✨ Agregar Película"}
                    </button>

                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <button
                            onClick={() => navigate('/inicio')}
                            style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}
                        >
                            ← Volver al Inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
