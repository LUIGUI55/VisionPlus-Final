import React, { useState, useEffect } from 'react';
import { moviesService } from '../services/api.js';

export default function PosterCarousel() {
    const [posters, setPosters] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        async function fetchPosters() {
            try {
                const movies = await moviesService.getPopularMovies();
                if (movies && movies.length > 0) {
                    // Filter movies that have a poster path
                    const validMovies = movies.filter(m => m.poster_path).slice(0, 5); // Take top 5
                    setPosters(validMovies);
                }
            } catch (error) {
                console.error("Error fetching posters for carousel:", error);
            }
        }
        fetchPosters();
    }, []);

    useEffect(() => {
        if (posters.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % posters.length);
        }, 3000); // Change every 3 seconds
        return () => clearInterval(interval);
    }, [posters]);

    if (posters.length === 0) return null;

    return (
        <div className="poster-carousel">
            {posters.map((movie, index) => (
                <img
                    key={movie.id}
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className={`carousel-image ${index === currentIndex ? 'active' : ''}`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '16px',
                        opacity: index === currentIndex ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        boxShadow: '0 0 20px rgba(141, 86, 185, 0.3)'
                    }}
                />
            ))}
        </div>
    );
}
