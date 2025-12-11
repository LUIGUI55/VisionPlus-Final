import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/auth/forgot-password', {
                email
            });

            setMensaje(response.data.message);

            // Si está en modo desarrollo y hay token, lo mostramos
            if (response.data.devToken) {
                console.log('🔑 Token de desarrollo:', response.data.devToken);
                setMensaje(
                    `${response.data.message}\n\n` +
                    `[MODO DESARROLLO] Token: ${response.data.devToken}\n` +
                    `Copia este token para usarlo en la siguiente pantalla.`
                );
            }

            // Limpiar formulario
            setEmail('');
        } catch (err) {
            console.error('Error al solicitar recuperación:', err);
            setError(
                err.response?.data?.message ||
                'Hubo un error al procesar tu solicitud. Intenta de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="logo-section">
                    <h1 className="logo">
                        <span className="vision">VISION</span>
                        <span className="plus">PLUS</span>
                    </h1>
                </div>

                <h2 className="forgot-title">Recuperar Contraseña</h2>
                <p className="forgot-subtitle">
                    Ingresa tu correo electrónico y te enviaremos instrucciones para recuperar tu contraseña
                </p>

                <form onSubmit={handleSubmit} className="forgot-form">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        {loading ? 'Enviando...' : 'Enviar Instrucciones'}
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

export default ForgotPassword;
