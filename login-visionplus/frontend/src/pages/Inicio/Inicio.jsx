import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Inicio.css';

import ContinueWatching from '../../components/ContinueWatching/ContinueWatching';

export default function Inicio() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // obtener datos del usuario del localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        // limpiar storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        console.log('👋 Sesión cerrada');
        navigate('/');
    };

    const goToCatalogo = () => {
        navigate('/profiles');
    };

    return (
        <div className="inicio-page">
            <header className="header">
                <div className="brand">VISIONPLUS</div>
                <button className="btn-logout" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </header>

            <main className="main-content">
                <div className="welcome-card">
                    <h1>🎬 Bienvenido a VisionPlus</h1>
                    {user && (
                        <p className="user-info">
                            Sesión iniciada como: <strong>{user.email}</strong>
                        </p>
                    )}

                    <div className="info-box">
                        <p>✅ Has iniciado sesión correctamente</p>
                        <p>Explora nuestro catálogo de películas comerciales.</p>

                        <button
                            onClick={goToCatalogo}
                            style={{
                                marginTop: '25px',
                                padding: '15px 40px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '30px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            🍿 Ver Catálogo de Películas
                        </button>
                    </div>
                </div>

                <ContinueWatching />
            </main>
        </div>
    );
}
