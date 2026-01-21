import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VisionPlusNeon.css";

export default function VisionPlusNeon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      navigate("/inicio");
    }, 1500);

  }

  function handlePlans() {
    navigate("/planes");
  }

  function goLogin(e) {
    e.preventDefault();
    navigate("/login");
  }

  return (
    <div className="container">
      <header className="header" aria-label="Cabecera">
        <div className="brand">VISIONPLUS</div>

        <nav className="nav" aria-label="acciones">
          <a href="/login" onClick={goLogin} aria-label="Iniciar sesión">
            Iniciar Sesión
          </a>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-inner">
          <section className="copy">
            <h1>
              Disfruta tus <span className="hl">películas</span> favoritas sin{" "}
              <span className="hl">límites</span>
            </h1>

            <p className="sub">
              Todo el cine, series y documentales en un solo lugar.
            </p>

            {/* Movie Carousel */}
            <div className="landing-carousel-container">
              <div className="carousel-track">
                {[
                  "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHkjDfoveCc.jpg",
                  "https://image.tmdb.org/t/p/w500/zJrZ1eD93r1E99n7ci5d9p2e3.jpg",
                  "https://image.tmdb.org/t/p/w500/6KErczPBROQty7QoIsaa6wJYXZi.jpg",
                  "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
                  "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
                  "https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg"
                ].map((src, i) => (
                  <div key={i} className="carousel-slide-landing" style={{
                    animationDelay: `${i * 2}s`
                  }}>
                    <img src={src} alt="Movie" />
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn btn-ghost"
              type="button"
              onClick={handlePlans}
            >
              Ver planes
            </button>

            <p className="note">Planes exclusivos para ti desde $99.</p>
          </section>
        </div >

        <div className="spacer" />
      </main >
    </div >
  );
}