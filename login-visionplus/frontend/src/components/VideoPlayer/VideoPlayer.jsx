import React from 'react';

const VideoPlayer = ({ videoId, libraryId, title }) => {
    // Construir la URL del embed de Bunny.net.
    // Nota: libraryId suele ser necesario si no es parte de la URL por defecto, 
    // pero la estructura básica es: https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}
    // Permitimos pasar libraryId como prop para flexibilidad, o usar uno por defecto si se tiene.

    // Si no se pasa libraryId, asumimos que el usuario lo configurará o lo pasará.
    // Por ahora usaremos un placeholder o props obligatorias.

    if (!videoId || !libraryId) {
        return <div className="text-white p-4">Error: Faltan datos del video (Library ID o Video ID)</div>;
    }

    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&loop=false&muted=false&preload=true`;

    return (
        <div className="w-full max-w-5xl mx-auto my-8">
            {title && <h2 className="text-2xl text-white mb-4 font-bold">{title}</h2>}
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
                <iframe
                    src={embedUrl}
                    loading="lazy"
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                    title={title || "Video Player"}
                ></iframe>
            </div>
        </div>
    );
};

export default VideoPlayer;
