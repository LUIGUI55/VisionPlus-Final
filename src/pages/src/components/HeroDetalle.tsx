import React from "react";

export default function HeroDetalle({ children }: { children?: React.ReactNode }) {
  return (
    <section className="hero-uv">
      <div className="hero-uv__layer" />
      <div className="hero-uv__content">
        {children ?? (
          <>
            <div className="hero-uv__media">
              <button className="hero-uv__play" aria-label="Reproducir">▶</button>
            </div>

            <div className="hero-uv__panel">
              <h2>Ficha técnica</h2>
              <p><strong>Año:</strong> 2025</p>
              <p><strong>Director:</strong> Renny Harlin</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
