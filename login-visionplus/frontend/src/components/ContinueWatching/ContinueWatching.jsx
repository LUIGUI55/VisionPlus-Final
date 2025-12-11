import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ContinueWatching.css';

export default function ContinueWatching() {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/history', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Solo tomar los últimos 6
            const recentHistory = response.data.slice(0, 6);

            // Enriquecer con datos de película
            const historyWithDetails = await Promise.all(
                recentHistory.map(async (item) => {
                    try {
                        const movieRes = await axios.get(
                            `http://localhost:3000/movies/${item.movieId}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        return { ...item, movie: movieRes.data };
                    } catch (e) {
                        return null;
                    }
                })
            );

            setHistory(historyWithDetails.filter(h => h !== null));
        } catch (error) {
            console.error('Error cargando historial:', error);
        }
    };

    if (history.length === 0) return null;

    return (
        <div className="continue-watching-section">
            <h2 className="section-title">Continuar Viendo</h2>
            <div className="continue-list">
                {history.map(item => (
                    <div key={item.id} className="continue-card" onClick={() => navigate(`/watch/${item.movieId}`)}>
                        <div className="thumbnail-container">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${item.movie.backdrop_path || item.movie.poster_path}`}
                                alt={item.movie.title}
                                className="thumbnail"
                            />
                            <div className="progress-bar-container">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(item.progress / item.duration) * 100}%` }}
                                ></div>
                            </div>
                            <div className="play-overlay">▶</div>
                        </div>
                        <div className="card-info">
                            <span className="movie-title">{item.movie.title}</span>
                            <span className="remaining-time">
                                {Math.floor((item.duration - item.progress) / 60)} min restantes
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
