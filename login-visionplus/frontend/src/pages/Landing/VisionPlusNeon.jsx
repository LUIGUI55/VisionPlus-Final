import React from "react";
import { useNavigate } from "react-router-dom";
import "./VisionPlusNeon.css";

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
              className="btn btn-ghost"
              type="button"
              onClick={handlePlans}
            >
              Ver planes
            </button>

            <p className="note">Planes exclusivos para ti desde $99.</p>
          </section>
        </div>

        <div className="spacer" />
      </main>
    </div>
  );
}