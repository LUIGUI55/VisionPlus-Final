import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';

const Player = () => {
    const { videoId } = useParams(); // Obtener videoId de la URL /watch/:videoId
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Opcional: Obtener libraryId de query params o usar una variable de entorno/constante
    // URL ejemplo: /watch/video123?lib=12345&title=MiPelicula
    const libraryId = searchParams.get('lib') || "579059";
    const title = searchParams.get('title') || "Reproduciendo";

    if (!videoId) {
        return <div className="text-white text-center mt-20">Video no encontrado.</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Botón de regreso simple */}
            <div className="p-4">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200 flex items-center gap-2"
                >
                    <span>←</span> Volver
                </button>
            </div>

            <div className="flex-grow flex flex-col justify-center px-4">
                <VideoPlayer videoId={videoId} libraryId={libraryId} title={title} />

                <div className="max-w-5xl mx-auto w-full mt-4 text-gray-400 text-sm p-2 bg-gray-900 rounded bg-opacity-50">
                    <p className="text-center">Powered by Bunny.net Stream & VisionPlus</p>
                </div>
            </div>
        </div>
    );
};

export default Player;
