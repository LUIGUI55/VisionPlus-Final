import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TipoContenido.css";

const TipoContenido = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const closeModals = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(-1);
    }, 200);
  };

  const handleTipoClick = (tipo) => {
    setIsOpen(false);
    navigate(`/resultados?tipo=${tipo}`);
  };

  return (
    <div className={`tipo-container ${isOpen ? "active" : ""}`}>
      <div className="tipo-overlay" onClick={closeModals}></div>

      <div className="tipo-modal">
        <button className="tipo-close-x" onClick={closeModals}>✕</button>

        <div className="tipo-title">¿De qué tipo?</div>

        <div className="tipo-options-grid">
          <div className="tipo-option-box" onClick={() => handleTipoClick("peliculas")}>
            Películas
          </div>

          <div className="tipo-option-box" onClick={() => handleTipoClick("series")}>
            Series
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipoContenido;