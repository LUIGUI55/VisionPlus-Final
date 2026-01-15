import React, { useState } from 'react';
import API_URL from '../../config';
import { Lock, Unlock, Link } from 'lucide-react';

const AddVideo = () => {
    // Auth State
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [secretInput, setSecretInput] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        tmdbId: '',
        bunnyVideoId: '',
        title: '',
        libraryId: '579059',
        type: 'movie',
        season: '',
        episode: ''
    });
    const [status, setStatus] = useState(null);

    // Initial Unlock
    const handleUnlock = (e) => {
        e.preventDefault();
        if (secretInput.trim()) {
            setIsUnlocked(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', msg: 'Guardando...' });

        try {
            const response = await fetch(`${API_URL}/videos/map`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-secret': secretInput // Send the secret header
                },
                body: JSON.stringify({
                    tmdbId: parseInt(formData.tmdbId),
                    bunnyVideoId: formData.bunnyVideoId,
                    title: formData.title,
                    libraryId: formData.libraryId,
                    type: formData.type,
                    season: formData.type === 'tv' ? parseInt(formData.season) : undefined,
                    episode: formData.type === 'tv' ? parseInt(formData.episode) : undefined
                })
            });

            if (response.ok) {
                setStatus({ type: 'success', msg: '✅ Video conectado exitosamente!' });
                setFormData({ ...formData, tmdbId: '', bunnyVideoId: '', title: '' });
            } else if (response.status === 403) {
                setStatus({ type: 'error', msg: '⛔ Contraseña incorrecta.' });
                setIsUnlocked(false);
            } else {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.message || response.statusText;
                setStatus({ type: 'error', msg: `❌ Error (${response.status}): ${errorMsg}` });
            }
        } catch (error) {
            setStatus({ type: 'error', msg: `❌ Error de conexión: ${error.message}` });
        }
    };

    // Estilos Inline (Reusados)
    const styles = {
        container: {
            minHeight: '100vh',
            backgroundColor: '#050505',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif"
        },
        blob1: {
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            zIndex: 0
        },
        blob2: {
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            zIndex: 0
        },
        content: {
            zIndex: 10,
            width: '100%',
            maxWidth: '500px',
            animation: 'fadeInUp 0.8s ease-out'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #c084fc, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
        },
        subtitle: {
            color: '#9ca3af',
            fontSize: '1rem',
            textAlign: 'center',
            marginBottom: '2rem'
        },
        card: {
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        },
        label: {
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#d1d5db',
            marginBottom: '0.5rem',
            marginLeft: '0.25rem'
        },
        input: {
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            color: 'white',
            fontSize: '1rem',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: '1.5rem'
        },
        button: {
            width: '100%',
            background: 'linear-gradient(to right, #9333ea, #db2777)',
            color: 'white',
            fontWeight: '700',
            padding: '0.875rem',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        },
        status: {
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            backgroundColor: status?.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: status?.type === 'success' ? '#4ade80' : '#f87171',
            border: `1px solid ${status?.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.blob1} />
            <div style={styles.blob2} />

            <div style={styles.content}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={styles.title}>
                        VisionPlus Admin
                    </h1>
                    <p style={styles.subtitle}>
                        {isUnlocked ? 'Conectar contenido a la plataforma' : 'Acceso Restringido'}
                    </p>
                </div>

                <div style={styles.card}>
                    {!isUnlocked ? (
                        // LOCK SCREEN
                        <form onSubmit={handleUnlock}>
                            <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#db2777' }}>
                                <Lock size={64} />
                            </div>
                            <div>
                                <label style={styles.label}>Contraseña de Administrador</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••••••"
                                    style={styles.input}
                                    value={secretInput}
                                    onChange={e => setSecretInput(e.target.value)}
                                />
                            </div>
                            <button type="submit" style={styles.button}>
                                <Unlock size={20} /> Desbloquear
                            </button>
                        </form>
                    ) : (
                        // ADMIN FORM
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label style={styles.label}>Tipo de Contenido</label>
                                <select
                                    style={{ ...styles.input, cursor: 'pointer' }}
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="movie">Película</option>
                                    <option value="tv">Serie (TV Show)</option>
                                </select>
                            </div>

                            <div>
                                <label style={styles.label}>{formData.type === 'tv' ? 'ID de la Serie (TV Show)' : 'ID de la Película (TMDB)'}</label>
                                <input
                                    type="number"
                                    required
                                    placeholder={formData.type === 'tv' ? "Ej: 46260 (Naruto)" : "Ej: 550 (Fight Club)"}
                                    style={styles.input}
                                    value={formData.tmdbId}
                                    onChange={e => setFormData({ ...formData, tmdbId: e.target.value })}
                                />
                            </div>

                            {formData.type === 'tv' && (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={styles.label}>Temporada #</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="1"
                                            style={styles.input}
                                            value={formData.season}
                                            onChange={e => setFormData({ ...formData, season: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={styles.label}>Episodio #</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="1"
                                            style={styles.input}
                                            value={formData.episode}
                                            onChange={e => setFormData({ ...formData, episode: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={styles.label}>Título de Referencia</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Fight Club"
                                    style={styles.input}
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>Bunny Video ID</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Pegar ID del video aquí..."
                                    style={styles.input}
                                    value={formData.bunnyVideoId}
                                    onChange={e => setFormData({ ...formData, bunnyVideoId: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={styles.label}>Library ID (Opcional)</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={formData.libraryId}
                                    onChange={e => setFormData({ ...formData, libraryId: e.target.value })}
                                />
                            </div>

                            <button type="submit" style={styles.button}>
                                <Link size={20} /> Conectar Video
                            </button>
                        </form>
                    )}

                    {status && (
                        <div style={styles.status}>
                            {status.msg}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddVideo;
