import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VisionPlusCatalogo.css';

const VisionPlusCatalogo = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [activeTab, setActiveTab] = useState('popular');
    const [contentType, setContentType] = useState('movie'); // 'movie', 'series', 'anime'
    const [favorites, setFavorites] = useState(new Set());
    const [watchlist, setWatchlist] = useState(new Set());
    const navigate = useNavigate();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    const getActiveProfileId = () => {
        const profile = localStorage.getItem('activeProfile');
        return profile ? JSON.parse(profile).id : null;
    };

    useEffect(() => {
        loadMovies(activeTab);
        loadUserLists();
    }, [activeTab, contentType]);

    const loadMovies = async (category) => {
        try {
            setLoading(true);
            let endpoint = '';

            if (contentType === 'movie') {
                endpoint = `http://localhost:3000/movies/${category}`;
            } else if (contentType === 'series') {
                if (category === 'popular') endpoint = `http://localhost:3000/movies/series/popular`;
                else if (category === 'trending') endpoint = `http://localhost:3000/movies/series/trending`;
                else if (category === 'top-rated') endpoint = `http://localhost:3000/movies/series/top-rated`;
            } else if (contentType === 'anime') {
                endpoint = `http://localhost:3000/movies/anime`;
            }

            const response = await axios.get(endpoint, getAuthHeaders());

            setMovies(response.data.results || []);
            console.log(`✅ Cargadas ${response.data.results?.length || 0} items de ${contentType}/${category}`);
        } catch (error) {
            console.error('Error cargando contenido:', error);

            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadUserLists = async () => {
        const profileId = getActiveProfileId();
        if (!profileId) return;

        try {
            const favResponse = await axios.get(
                `http://localhost:3000/lists/favorites?profileId=${profileId}`,
                getAuthHeaders()
            );
            const favIds = new Set(favResponse.data.map(item => item.movieId));
            setFavorites(favIds);

            const watchResponse = await axios.get(
                `http://localhost:3000/lists/watchlist?profileId=${profileId}`,
                getAuthHeaders()
            );
            const watchIds = new Set(watchResponse.data.map(item => item.movieId));
            setWatchlist(watchIds);
        } catch (error) {
            console.error('Error cargando listas:', error);
        }
    };

    const toggleFavorite = async (movie, e) => {
        e.stopPropagation();
        const profileId = getActiveProfileId();
        if (!profileId) {
            alert('Debes seleccionar un perfil primero');
            return;
        }

        const isFavorite = favorites.has(movie.id);

        try {
            if (isFavorite) {
                await axios.delete(
                    `http://localhost:3000/lists/favorites/${movie.id}?profileId=${profileId}`,
                    getAuthHeaders()
                );
                setFavorites(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(movie.id);
                    return newSet;
                });
            } else {
                await axios.post(
                    'http://localhost:3000/lists/favorites',
                    {
                        profileId,
                        movieId: movie.id,
                        movieData: {
                            title: movie.title || movie.name, // movie.name for TV shows
                            posterPath: movie.poster_path,
                            voteAverage: movie.vote_average,
                            releaseDate: movie.release_date || movie.first_air_date // first_air_date for TV
                        }
                    },
                    getAuthHeaders()
                );
                setFavorites(prev => new Set([...prev, movie.id]));
            }
        } catch (error) {
            console.error('Error toggle favorito:', error);
        }
    };

    const toggleWatchlist = async (movie, e) => {
        e.stopPropagation();
        const profileId = getActiveProfileId();
        if (!profileId) {
            alert('Debes seleccionar un perfil primero');
            return;
        }

        const isInWatchlist = watchlist.has(movie.id);

        try {
            if (isInWatchlist) {
                await axios.delete(
                    `http://localhost:3000/lists/watchlist/${movie.id}?profileId=${profileId}`,
                    getAuthHeaders()
                );
                setWatchlist(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(movie.id);
                    return newSet;
                });
            } else {
                await axios.post(
                    'http://localhost:3000/lists/watchlist',
                    {
                        profileId,
                        movieId: movie.id,
                        movieData: {
                            title: movie.title || movie.name,
                            posterPath: movie.poster_path,
                            voteAverage: movie.vote_average,
                            releaseDate: movie.release_date || movie.first_air_date
                        }
                    },
                    getAuthHeaders()
                );
                setWatchlist(prev => new Set([...prev, movie.id]));
            }
        } catch (error) {
            console.error('Error toggle watchlist:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            loadMovies(activeTab);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3000/movies/search?query=${searchQuery}`,
                getAuthHeaders()
            );
            setMovies(response.data.results || []);
        } catch (error) {
            console.error('Error en búsqueda:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMovieClick = async (movieId) => {
        try {
            let endpoint = '';
            // Anime is fetched as TV show
            if (contentType === 'movie') {
                endpoint = `http://localhost:3000/movies/${movieId}`;
            } else {
                endpoint = `http://localhost:3000/movies/series/${movieId}`;
            }

            const response = await axios.get(endpoint, getAuthHeaders());
            setSelectedMovie(response.data);
        } catch (error) {
            console.error('Error cargando detalles:', error);
        }
    };

    const closeModal = () => {
        setSelectedMovie(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('activeProfile');
        navigate('/');
    };

    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    return (
        <div className="catalogo-container">
            <header className="catalogo-header">
                <div className="header-content">
                    <h1 className="logo">🎬 VisionPlus</h1>

                    <nav className="main-nav">
                        <button className="nav-item" onClick={() => navigate('/inicio')}>Inicio</button>
                        <button
                            className={`nav-item ${contentType === 'movie' ? 'active' : ''}`}
                            onClick={() => { setContentType('movie'); setActiveTab('popular'); }}
                        >
                            Películas
                        </button>
                        <button
                            className={`nav-item ${contentType === 'series' ? 'active' : ''}`}
                            onClick={() => { setContentType('series'); setActiveTab('popular'); }}
                        >
                            Series
                        </button>
                        <button
                            className={`nav-item ${contentType === 'anime' ? 'active' : ''}`}
                            onClick={() => { setContentType('anime'); setActiveTab('popular'); }}
                        >
                            Anime
                        </button>
                    </nav>

                    <div className="header-actions">
                        <button onClick={() => navigate('/profiles')} className="btn-profile">
                            👤 Perfil
                        </button>
                        <button onClick={handleLogout} className="btn-logout">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        🔍 Buscar
                    </button>
                </form>
            </div>

            {contentType !== 'anime' && (
                <div className="tabs-container">
                    <button
                        className={`tab ${activeTab === 'popular' ? 'active' : ''}`}
                        onClick={() => setActiveTab('popular')}
                    >
                        🔥 Populares
                    </button>
                    <button
                        className={`tab ${activeTab === 'trending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trending')}
                    >
                        📈 Tendencias
                    </button>
                    <button
                        className={`tab ${activeTab === 'top-rated' ? 'active' : ''}`}
                        onClick={() => setActiveTab('top-rated')}
                    >
                        ⭐ Mejor Calificadas
                    </button>
                </div>
            )}

            <div className="movies-container">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Cargando películas...</p>
                    </div>
                ) : (
                    <div className="movies-grid">
                        {movies.map((movie) => (
                            <div key={movie.id} className="movie-card">
                                <div className="movie-poster" onClick={() => handleMovieClick(movie.id)}>
                                    {movie.poster_path ? (
                                        <img
                                            src={`${imageBaseUrl}${movie.poster_path}`}
                                            alt={movie.title}
                                        />
                                    ) : (
                                        <div className="no-poster">Sin imagen</div>
                                    )}
                                </div>

                                <div className="movie-actions">
                                    <button
                                        className={`action-btn ${favorites.has(movie.id) ? 'active' : ''}`}
                                        onClick={(e) => toggleFavorite(movie, e)}
                                        title={favorites.has(movie.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                    >
                                        {favorites.has(movie.id) ? '❤️' : '🤍'}
                                    </button>
                                    <button
                                        className={`action-btn ${watchlist.has(movie.id) ? 'active' : ''}`}
                                        onClick={(e) => toggleWatchlist(movie, e)}
                                        title={watchlist.has(movie.id) ? 'Quitar de watchlist' : 'Agregar a watchlist'}
                                    >
                                        {watchlist.has(movie.id) ? '✅' : '➕'}
                                    </button>
                                </div>

                                <div className="movie-info">
                                    <h3 className="movie-title">{movie.title || movie.name}</h3>
                                    <div className="movie-meta">
                                        <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                                        <span className="year">
                                            {(movie.release_date || movie.first_air_date)?.split('-')[0]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedMovie && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>✕</button>

                        <div className="modal-body">
                            <div className="modal-poster">
                                {selectedMovie.poster_path && (
                                    <img
                                        src={`${imageBaseUrl}${selectedMovie.poster_path}`}
                                        alt={selectedMovie.title || selectedMovie.name}
                                    />
                                )}
                            </div>

                            <div className="modal-details">
                                <h2>{selectedMovie.title || selectedMovie.name}</h2>
                                <p className="tagline">{selectedMovie.tagline}</p>

                                <div className="details-row">
                                    <span>⭐ {selectedMovie.vote_average?.toFixed(1)}/10</span>
                                    <span>🎭 {selectedMovie.genres?.map(g => g.name).join(', ')}</span>
                                    <span>📅 {selectedMovie.release_date || selectedMovie.first_air_date}</span>
                                </div>

                                <button
                                    onClick={() => navigate(`/watch/${selectedMovie.id}`)}
                                    className="btn-play"
                                >
                                    ▶️ Reproducir
                                </button>

                                <h3>Sinopsis</h3>
                                <p className="overview">{selectedMovie.overview}</p>

                                {selectedMovie.credits?.cast && (
                                    <>
                                        <h3>Reparto Principal</h3>
                                        <div className="cast-list">
                                            {selectedMovie.credits.cast.slice(0, 5).map((actor) => (
                                                <span key={actor.id} className="cast-member">
                                                    {actor.name}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisionPlusCatalogo;
