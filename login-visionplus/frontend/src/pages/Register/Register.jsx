import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validación de passwords coincidentes
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        // Validación de password fuerte
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
            setLoading(false);
            return;
        }

        try {
            // Llamada al backend
            const response = await axios.post("http://localhost:3000/auth/register", {
                email: formData.email,
                password: formData.password,
                name: formData.name || undefined
            });

            console.log("✅ Registro exitoso:", response.data);

            // Mostrar mensaje de éxito y redirigir al login
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            navigate("/");
        } catch (err) {
            console.error("❌ Error en registro:", err);

            if (err.response) {
                // El servidor respondió con un error
                if (err.response.status === 401) {
                    setError("El correo electrónico ya está registrado");
                } else {
                    setError(err.response.data.message || "Error al registrar usuario");
                }
            } else if (err.request) {
                // No hubo respuesta del servidor
                setError("No se pudo conectar con el servidor. ¿Está encendido?");
            } else {
                setError("Error inesperado");
            }
        } finally {
            setLoading(false);
        }
    };

    const goToLogin = () => {
        navigate("/");
    };

    return (
        <div className="register-page">
            <header className="header">
                <div className="brand">VISIONPLUS</div>
            </header>

            <main className="hero">
                <div className="card">
                    <div className="title">
                        <div className="icon"></div>
                        <h1>Crear Cuenta</h1>
                    </div>

                    <form className="form" onSubmit={handleSubmit}>
                        {/* Mostrar error si hay */}
                        {error && (
                            <div style={{
                                padding: "12px",
                                background: "#ff4444",
                                borderRadius: "8px",
                                color: "white",
                                marginBottom: "10px",
                            }}>
                                {error}
                            </div>
                        )}

                        <div className="field">
                            <label htmlFor="name">Nombre (opcional)</label>
                            <input
                                className="input"
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Tu nombre"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="email">Correo electrónico</label>
                            <input
                                className="input"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                className="input"
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <small style={{ color: "#888", fontSize: "12px" }}>
                                Mínimo 8 caracteres, una mayúscula, una minúscula y un número
                            </small>
                        </div>

                        <div className="field">
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                            <input
                                className="input"
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="actions">
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Registrando..." : "Crear Cuenta"}
                            </button>
                        </div>

                        <div className="bottom">
                            <span
                                className="muted"
                                onClick={goToLogin}
                                style={{ cursor: "pointer" }}
                            >
                                ¿Ya tienes cuenta? Inicia sesión
                            </span>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
