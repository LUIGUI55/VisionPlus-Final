import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener token de la URL
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        // Validaciones del frontend
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!token) {
            setError('Token no válido. Por favor solicita un nuevo enlace de recuperación.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/auth/reset-password', {
                token,
                newPassword
            });

            setMensaje(response.data.message);

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error('Error al resetear contraseña:', err);
            setError(
                err.response?.data?.message ||
                'Hubo un error al resetear tu contraseña. El token puede haber expirado.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="logo-section">
                    <h1 className="logo">
                        <span className="vision">VISION</span>
                        <span className="plus">PLUS</span>
                    </h1>
                </div>

                <h2 className="reset-title">Nueva Contraseña</h2>
                <p className="reset-subtitle">
                    Ingresa tu nueva contraseña. Asegúrate de que sea segura y fácil de recordar.
                </p>

                <form onSubmit={handleSubmit} className="reset-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Token (desde el correo o consola)"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Confirmar nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {mensaje && <div className="success-message">{mensaje}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                </form>

                <div className="back-to-login">
                    <button onClick={() => navigate('/')} className="back-button">
                        ← Volver al inicio de sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
