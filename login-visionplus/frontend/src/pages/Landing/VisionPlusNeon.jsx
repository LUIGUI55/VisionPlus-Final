import React from "react";
import { useNavigate } from "react-router-dom";
import "./VisionPlusNeon.css";
// import PosterCarousel from "../../components/PosterCarousel"; // Assuming you want me to create this or it exists
// Since I created it in src/components, the path is correct
import PosterCarousel from "../../components/PosterCarousel.jsx";

export default function VisionPlusNeon() {
  const navigate = useNavigate();

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

            <button
              className="btn btn-primary"
              type="button"
              onClick={handlePlans}
              style={{ fontSize: "1.2rem", padding: "16px 32px" }}
            >
              Ver planes
            </button>

            <p className="note" style={{ marginTop: "16px", color: "#9aa3b2" }}>
              Planes exclusivos para ti desde $99.
            </p>
          </section>

          <section className="carousel-container">
            <PosterCarousel />
          </section>
        </div>

        <div className="spacer" />
      </main>
    </div>
  );
}
