// src/pages/Login/VisionPlusLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./VisionPlusLogin.css";

export default function VisionPlusLogin({ backgroundUrl = "fondo.jpg" }) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // limpiar errores previos (si es que hubo)
        setLoading(true);

        const data = Object.fromEntries(new FormData(e.target));
        console.log("Intentando login con:", data.email); // para debugear

        try {
            // llamada al backend
            // ojalá el backend esté corriendo
            const response = await axios.post("http://localhost:3000/auth/login", {
                email: data.email,
                password: data.password,
            });

            console.log("✅ Login exitoso:", response.data);

            // guardar token en localStorage (dicen que no es seguro pero es lo que sé hacer)
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // redirigir al inicio
            navigate("/inicio");
        } catch (err) {
            console.error("❌ Error en login:", err);

            if (err.response) {
                // el servidor respondió con un error
                setError(err.response.data.message || "Ups, credenciales incorrectas. ¿Seguro que es tu cuenta?");
            } else if (err.request) {
                // no hubo respuesta del servidor
                setError("El servidor no responde. ¿Lo prendiste? (Revisa la terminal)");
            } else {
                setError("Algo explotó y no sé qué fue 🤷‍♂️");
            }
        } finally {
            setLoading(false);
        }
    };

    // funciones que aun no funcionan porque no tenemos esas paginas
    function goRegister(e) {
        e.preventDefault();
        navigate("/register");
    }

    function goChangePassword(e) {
        e.preventDefault();
        navigate("/forgot-password");
    }

    return (
        <div className="login-page">
            <header className="header">
                <div className="brand">VISIONPLUS</div>
            </header>

            <main
                className="hero"
                style={{ "--hero-image": `url('${backgroundUrl}')` }}
            >
                <div className="card">
                    <div className="title">
                        <div className="icon"></div>
                        <h1>Iniciar sesión</h1>
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
                            <label htmlFor="email">Correo electrónico o usuario</label>
                            <input
                                className="input"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
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
                                required
                            />
                        </div>

                        <div className="actions">
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Cargando..." : "Iniciar sesión"}
                            </button>

                            <a className="link" href="#" onClick={goChangePassword}>
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <div className="bottom">
                            <span className="muted" onClick={goRegister} style={{ cursor: "pointer" }}>
                                ¿No tienes cuenta?
                            </span>

                            <label className="checkbox">
                                <input type="checkbox" />
                                <span>Recordar sesión</span>
                            </label>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
