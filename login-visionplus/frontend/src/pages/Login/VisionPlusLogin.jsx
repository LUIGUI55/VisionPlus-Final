import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import "./VisionPlusLogin.css";

export default function VisionPlusLogin({ backgroundUrl = "fondo.jpg" }) {

  const navigate = useNavigate();

  function goDetail(e) {
    e.preventDefault();
    navigate("/inicio");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await authService.login(email, password);
      navigate("/inicio");
    } catch (error) {
      console.error("Login failed", error);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  function goRegister(e) {
    e.preventDefault();
    navigate("/register");
  }

  function goChangePassword(e) {
    e.preventDefault();
    navigate("/changepassword");
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

            <div className="field">
              <label htmlFor="email">Correo electrónico o usuario</label>
              <input
                className="input"
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
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
              />
            </div>

            <div className="actions">
              <button className="btn btn-primary" type="submit">
                Iniciar sesión
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

        <div style={{
          position: 'absolute',
          right: '-280px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '240px',
          height: '360px',
          zIndex: 5,
          display: 'none'
        }} className="landing-carousel">
          {/* Hidden legacy container, removing logic to clean up */}
        </div>

    </div>
        
        {/* NEW CAROUSEL CONTAINER SIDE BY SIDE */ }
  <div className="landing-carousel-container">
    <div className="carousel-track">
      {[
        "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHkjDfoveCc.jpg", // Spiderman
        "https://image.tmdb.org/t/p/w500/zJrZ1eD93r1E99n7ci5d9p2e3.jpg", // The Batman
        "https://image.tmdb.org/t/p/w500/6KErczPBROQty7QoIsaa6wJYXZi.jpg", // Mario
        "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" // Across the spiderverse
      ].map((src, i) => (
        <div key={i} className="carousel-slide-landing" style={{
          animationDelay: `${i * 2}s`
        }}>
          <img src={src} alt="Movie" />
        </div>
      ))}
    </div>
  </div>

      </main >
    </div >
  );
}