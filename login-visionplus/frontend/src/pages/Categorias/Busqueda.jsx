import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Busqueda.css";

const Busqueda = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const closeSearch = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(-1);
    }, 200);
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;
    setIsOpen(false);
    navigate(`/resultados?q=${encodeURIComponent(searchText)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleCategoryClick = (key) => {
    setSelectedCat(key);
    setIsOpen(false);
    navigate(`/tipocontenido?cat=${key}`);
  };

  return (
    <div className={`busqueda-container ${isOpen ? "active" : ""}`}>
      <div className="busqueda-overlay" onClick={closeSearch}></div>

      <div className="busqueda-modal">
        <button className="busqueda-close-x" onClick={closeSearch}>✕</button>

        <div className="busqueda-title">¿Qué te apetece ver?</div>
        <div className="busqueda-sub">
          Elige una emoción o género y descubre nuevas recomendaciones.
        </div>

        <div className="busqueda-row">
          <div className="busqueda-input-wrapper">
            <input
              type="text"
              placeholder="Buscar serie o película..."
              autoFocus
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button className="busqueda-btn-lupa" onClick={handleSearch}>🔍</button>
        </div>

        <div className="busqueda-cat-grid">
          {[
            { key: "reir", label: "Reír" },
            { key: "pasar", label: "Pasar el rato" },
            { key: "fantasia", label: "Fantástico" },
            { key: "llorar", label: "Llorar" },
            { key: "miedo", label: "Miedo" },
            { key: "accion", label: "Acción" },
          ].map((cat) => (
            <div
              key={cat.key}
              className={`busqueda-cat-item ${selectedCat === cat.key ? "selected" : ""}`}
              onClick={() => handleCategoryClick(cat.key)}
            >
              {cat.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Busqueda;