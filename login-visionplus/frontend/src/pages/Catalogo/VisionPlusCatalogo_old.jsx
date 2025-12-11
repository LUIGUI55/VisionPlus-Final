import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VisionPlusCatalogo.css';

const VisionPlusCatalogo = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [activeTab, setActiveTab] = useState('popular'); // popular, trending, top-rated
    const [favorites, setFavorites] = useState(new Set()); // IDs de películas favoritas
    const [watchlist, setWatchlist] = useState(new Set()); // IDs de películas en watchlist
    const navigate = useNavigate();

    // Obtener el token JWT del localStorage
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    // Obtener profileId activo
    const getActiveProfileId = () => {
        const profile = localStorage.getItem('activeProfile');
        return profile ? JSON.parse(profile).id : null;
    };

    // Cargar películas según la pestaña activa
    useEffect(() => {
        loadMovies(activeTab);
        loadUserLists(); // Cargar las listas del usuario
    }, [activeTab]);

    const loadMovies = async (category) => {
        try {
            setLoading(true);
            const endpoint = `http://localhost:3000/movies/${category}`;
            const response = await axios.get(endpoint, getAuthHeaders());

            // TMDB devuelve los resultados en response.data.results
            setMovies(response.data.results || []);
            console.log(`✅ Cargadas ${response.data.results?.length || 0} películas de ${category}`);
        } catch (error) {
            console.error('Error cargando películas:', error);

            // Si el token expiró, redirigir al login
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    // Buscar películas
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
            console.log(`🔍 Encontradas ${response.data.results?.length || 0} películas`);
        } catch (error) {
            console.error('Error en búsqueda:', error);
        } finally {
            setLoading(false);
        }
    };

    // Obtener detalles de una película
    const handleMovieClick = async (movieId) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/movies/${movieId}`,
                getAuthHeaders()
            );
            setSelectedMovie(response.data);
            console.log('🎬 Detalles cargados:', response.data.title);
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

    // Cargar listas del usuario (favoritos y watchlist)
    const loadUserLists = async () => {
        const profileId = getActiveProfileId();
        if (!profileId) return;

        try {
            // Cargar favoritos
            const favResponse = await axios.get(
                `http://localhost:3000/lists/favorites?profileId=${profileId}`,
                getAuthHeaders()
            );
            const favIds = new Set(favResponse.data.map(item => item.movieId));
            setFavorites(favIds);

            // Cargar watchlist
            const watchResponse = await axios.get(
                `http://localhost:3000/lists/watchlist?profileId=${profileId}`,
                getAuthHeaders()
            );
            const watchIds = new Set(watchResponse.data.map(item => item.movieId));
            setWatchlist(watchIds);

            console.log(`✅ Listas cargadas: ${favIds.size} favoritos, ${watchIds.size} watchlist`);
        } catch (error) {
            console.error('Error cargando listas:', error);
        }
    };

    // Toggle favorito
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
                // Quitar de favoritos
                await axios.delete(
                    `http://localhost:3000/lists/favorites/${movie.id}?profileId=${profileId}`,
                    getAuthHeaders()
                );
                setFavorites(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(movie.id);
                    return newSet;
                });
                console.log('💔 Removido de favoritos:', movie.title);
            } else {
                // Agregar a favoritos
                await axios.post(
                    'http://localhost:3000/lists/favorites',
                    {
                        profileId,
                        movieId: movie.id,
                        movieData: {
                            title: movie.title,
                            posterPath: movie.poster_path,
                            voteAverage: movie.vote_average,
                            releaseDate: movie.release_date
                        }
                    },
                    getAuthHeaders()
                );
                setFavorites(prev => new Set([...prev, movie.id]));
                console.log('❤️ Agregado a favoritos:', movie.title);
            }
        } catch (error) {
            console.error('Error toggle favorito:', error);
            alert('Error al actualizar favoritos');
        }
    };

    // Toggle watchlist
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
                // Quitar de watchlist
                await axios.delete(
                    `http://localhost:3000/lists/watchlist/${movie.id}?profileId=${profileId}`,
                    getAuthHeaders()
                );
                setWatchlist(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(movie.id);
                    return newSet;
                });
                console.log('➖ Removido de watchlist:', movie.title);
            } else {
                // Agregar a watchlist
                await axios.post(
                    'http://localhost:3000/lists/watchlist',
                    {
                        profileId,
                        movieId: movie.id,
                        movieData: {
                            title: movie.title,
                            posterPath: movie.poster_path,
                            voteAverage: movie.vote_average,
                            releaseDate: movie.release_date
                        }
                    },
                    getAuthHeaders()
                );
                setWatchlist(prev => new Set([...prev, movie.id]));
                console.log('➕ Agregado a watchlist:', movie.title);
            }
        } catch (error) {
            console.error('Error toggle watchlist:', error);
            alert('Error al actualizar watchlist');
        }
    };

    // URL base para las imágenes de TMDB
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

    return (
        <div className="catalogo-container">
            {/* Header */}
            <header className="catalogo-header">
                <div className="header-content">
                    <h1 className="logo">🎬 VisionPlus</h1>
                    <nav className="header-nav">
                        <button onClick={() => navigate('/favorites')} className="nav-link">
                            ❤️ Favoritos
                        </button>
                        <button onClick={() => navigate('/watchlist')} className="nav-link">
                            ➕ Ver Más Tarde
                        </button>
                    </nav>
                    <div className="header-actions">
                        <button onClick={() => navigate('/profiles')} className="btn-volver">
                            Cambiar Perfil
                        </button>
                        <button onClick={handleLogout} className="btn-logout">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Search Bar */}
            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Buscar películas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        🔍 Buscar
                    </button>
                </form>
            </div>

            {/* Tabs */}
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

            {/* Movies Grid */}
            <div className="movies-container">
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Cargando películas...</p>
                    </div>
                ) : (
                    { selectedMovie && (
                        <div className="modal-overlay" onClick={closeModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <button className="modal-close" onClick={closeModal}>✕</button>

                                <div className="modal-body">
                                    <div className="modal-poster">
                                        {selectedMovie.poster_path && (
                                            <img
                                                src={`${imageBaseUrl}${selectedMovie.poster_path}`}
                                                alt={selectedMovie.title}
                                            />
                                        )}
                                    </div>

                                    <div className="modal-details">
                                        <h2>{selectedMovie.title}</h2>
                                        <p className="tagline">{selectedMovie.tagline}</p>

                                        <div className="details-row">
                                            <span>⭐ {selectedMovie.vote_average?.toFixed(1)}/10</span>
                                            <span>🎭 {selectedMovie.genres?.map(g => g.name).join(', ')}</span>
                                            <span>📅 {selectedMovie.release_date}</span>
                                        </div>

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
