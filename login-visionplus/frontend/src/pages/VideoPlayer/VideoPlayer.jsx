import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VideoPlayer.css';

export default function VideoPlayer() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        loadVideo();
    }, [movieId]);

    const loadVideo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:3000/videos/${movieId}/stream`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setVideoData(response.data);
            console.log('🎬 Video cargado:', response.data.title);
        } catch (error) {
            console.error('Error cargando video:', error);
            alert('Error al cargar el video');
            navigate('/catalogo');
        } finally {
            setLoading(false);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (playing) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    // Cargar progreso guardado
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:3000/history/${movieId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data && response.data.progress > 0) {
                    console.log('🕒 Progreso recuperado:', response.data.progress);
                    if (videoRef.current) {
                        videoRef.current.currentTime = response.data.progress;
                        setCurrentTime(response.data.progress);
                    }
                }
            } catch (error) {
                // Es normal si no hay historial
                console.log('Nuevo en esta película');
            }
        };

        if (!loading && videoData) {
            loadProgress();
        }
    }, [loading, videoData, movieId]);

    // Guardar progreso periódicamente
    useEffect(() => {
        const saveInterval = setInterval(() => {
            console.log('⏱️ Intervalo check:', { playing, currentTime: videoRef.current?.currentTime });
            if (videoRef.current && videoRef.current.currentTime > 0) {
                saveProgress(videoRef.current.currentTime);
            }
        }, 5000); // reducir a 5s para testing

        return () => clearInterval(saveInterval);
    }, [playing, movieId, duration]);

    const saveProgress = async (time) => {
        if (!time || time < 5) return; // No guardar si es muy poco
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:3000/history',
                {
                    movieId: parseInt(movieId),
                    progress: Math.floor(time),
                    duration: Math.floor(duration)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('💾 Progreso guardado:', Math.floor(time));
        } catch (error) {
            console.error('Error guardando progreso:', error);
        }
    };

    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * duration;
        videoRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current?.requestFullscreen();
            setFullscreen(true);
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="video-player-page">
                <div className="loading">Cargando video...</div>
            </div>
        );
    }

    return (
        <div className="video-player-page">
            <button onClick={() => {
                if (videoRef.current) saveProgress(videoRef.current.currentTime);
                navigate('/catalogo');
            }} className="btn-back">
                ← Volver al Catálogo
            </button>

            <div className="video-wrapper">
                <video
                    ref={videoRef}
                    src={videoData?.url}
                    className="video-element"
                    autoPlay
                    muted
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                />

                <div className="video-controls">
                    <div className="progress-bar">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={(currentTime / duration) * 100 || 0}
                            onChange={handleSeek}
                            className="seek-bar"
                        />
                    </div>

                    <div className="controls-row">
                        <div className="controls-left">
                            <button onClick={togglePlay} className="control-btn">
                                {playing ? '⏸' : '▶'}
                            </button>
                            <span className="time-display">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        <div className="controls-right">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="volume-slider"
                            />
                            <button onClick={toggleFullscreen} className="control-btn">
                                {fullscreen ? '🗗' : '⛶'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="video-info">
                    <h2>{videoData?.title || `Película ${movieId}`}</h2>
                    <p className="video-subtitle">Demo Video - VisionPlus</p>
                </div>
            </div>
        </div>
    );
}
