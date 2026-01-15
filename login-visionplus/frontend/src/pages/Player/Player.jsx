import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import API_URL from '../../config';

const Player = () => {
    const [videoData, setVideoData] = useState(null);
    const [error, setError] = useState(null);
    const { videoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchVideoData = async () => {
            if (!videoId) return;

            const searchParams = new URLSearchParams(location.search);
            const season = searchParams.get('season');
            const episode = searchParams.get('episode');

            let url = `${API_URL}/videos/${videoId}/stream`;
            if (season && episode) {
                url += `?season=${season}&episode=${episode}`;
            }

            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error('Error loading video from backend');

                const data = await response.json();

                if (data.type === 'bunny') {
                    setVideoData({
                        id: data.videoId,
                        libraryId: data.libraryId,
                        title: data.title || "Película",
                        type: 'bunny'
                    });
                } else if (data.title && data.title.includes("(Default)")) {
                    // Si devuelve el video por defecto, significa que no está disponible
                    setError("Película no disponible en este momento.");
                } else {
                    // Demo / MP4 fallback (solo si es un demo explícito, no el default)
                    setVideoData({
                        id: data.url,
                        libraryId: null,
                        title: data.title || "Video",
                        type: 'mp4'
                    });
                }
            } catch (error) {
                console.error("Error fetching video:", error);

                // Intentar fallback si es un error de red o backend
                if (["550", "680"].includes(videoId)) {
                    setVideoData({
                        id: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        libraryId: null,
                        title: "Demo Fallback",
                        type: 'mp4'
                    });
                } else {
                    setError(error.message);
                }
            }
        };

        fetchVideoData();
    }, [videoId]);

    if (!videoId) {
        return <div className="text-white text-center mt-20">Video no encontrado (ID inválido).</div>;
    }

    if (error) {
        return (
            <div className="fixed inset-0 w-full h-full bg-black flex flex-col items-center justify-center text-white z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 bg-gray-800 rounded-full"
                >
                    <ArrowLeft />
                </button>
                <div className="text-red-500 text-xl font-bold mb-4">Error</div>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-purple-600 rounded">Reintentar</button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-full h-full bg-black z-50 overflow-hidden flex flex-col">
            {/* Botón de regreso Flotante */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-[60] p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-all duration-200 border border-white/10"
                aria-label="Volver"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Contenedor de Video Full Screen */}
            <div className="w-full h-full flex items-center justify-center bg-black">
                {videoData ? (
                    <div className="w-full h-full">
                        <VideoPlayer
                            videoId={videoData.id}
                            libraryId={videoData.libraryId}
                            title={videoData.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="text-white">Cargando video...</div>
                )}
            </div>

            {/* Footer opcional (ocultable o muy sutil) */}
            <div className="absolute bottom-4 right-4 z-[60] text-gray-500 text-xs opacity-50 pointer-events-none">
                <p>VisionPlus Player</p>
            </div>
        </div>
    );
};

export default Player;
