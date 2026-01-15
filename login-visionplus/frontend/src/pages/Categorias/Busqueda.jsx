import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Smile, Meh, Sparkles, Frown, Ghost, Zap, Search, X } from "lucide-react";

const Busqueda = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  const closeSearch = () => setIsOpen(false);

  const handleCategoryClick = (key) => {
    setSelectedCat(key);
    setIsOpen(false);
    navigate(`/tipocontenido?cat=${key}`);
  };

  const categories = [
    { key: "reir", label: "Reír", icon: <Smile size={32} /> },
    { key: "pasar", label: "Pasar el rato", icon: <Meh size={32} /> },
    { key: "fantasia", label: "Fantástico", icon: <Sparkles size={32} /> },
    { key: "llorar", label: "Llorar", icon: <Frown size={32} /> },
    { key: "miedo", label: "Miedo", icon: <Ghost size={32} /> },
    { key: "accion", label: "Acción", icon: <Zap size={32} /> },
  ];

  return (
    <>
      <style>{`
        :root {
          --bg: #0e1117;
          --panel: #141925;
          --panel-2: #1a2030;
          --purple: #9d4edd;
          --text: #e8eaf0;
          --muted: #aeb3c2;
        }

        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          font-family: "Nunito Sans", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        body {
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          color: var(--text);
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(14, 17, 23, 0.9);
          z-index: 10;
          display: none;
        }

        .overlay.active {
          display: block;
        }

        .modal-wrapper {
          width: min(920px, 92%);
          max-width: 1000px;
          border-radius: 24px;
          padding: 40px;
          background: var(--panel);
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          border: 1px solid rgba(157, 78, 221, 0.3);
          box-shadow: 0 0 50px rgba(157, 78, 221, 0.15);
          z-index: 20;
          display: none;
        }

        .modal-wrapper.active {
          display: block;
          animation: modalFadeIn 0.3s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: translate(-50%, -40%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }

        .close-x {
          position: absolute;
          right: 24px;
          top: 24px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          cursor: pointer;
          color: var(--muted);
          border: none;
          background: transparent;
          transition: all 0.2s ease;
        }

        .close-x:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .modal-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0 0 16px;
          background: linear-gradient(to right, #c084fc, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .modal-sub {
          color: var(--muted);
          margin-bottom: 32px;
          font-size: 1.1rem;
        }

        .search-row {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 40px;
          justify-content: center;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .search-input {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.3);
          padding: 16px 24px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .search-input:focus-within {
          border-color: var(--purple);
          box-shadow: 0 0 0 2px rgba(157, 78, 221, 0.2);
        }

        .search-input input {
          background: transparent;
          border: 0;
          outline: 0;
          color: var(--text);
          width: 100%;
          font-size: 1.1rem;
        }

        .search-btn {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          border: none;
          background: var(--purple);
          display: grid;
          place-items: center;
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .search-btn:hover {
          transform: scale(1.05);
          background: #8e44c9;
        }

        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .cat {
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 120px;
          color: var(--muted);
          border: 1px solid transparent; /* Keep invisible border to avoid jumping */
        }

        .cat:hover {
          transform: translateY(-5px);
          color: #fff;
          /* background removed as requested */
          border-color: transparent; /* Changed from purple to transparent per request for "no background/border" look if implied */
        }

        .cat-icon {
          color: var(--purple);
          transition: transform 0.2s ease;
        }

        .cat:hover .cat-icon {
          transform: scale(1.2); /* Slightly larger scale for effect */
          color: #fff;
        }

        .cat.selected {
          border-color: var(--purple);
          background: rgba(157, 78, 221, 0.2);
          color: #fff;
        }

        @media (max-width: 720px) {
          .cat-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .modal-wrapper {
            padding: 24px;
            width: min(94%, 640px);
          }
          .modal-title {
            font-size: 1.8rem;
          }
        }
        
        * {
          box-shadow: none !important;
        }
        
        .dot {
          display: none !important;
        }
      `}</style>

      <div
        className={`overlay ${isOpen ? "active" : ""}`}
        onClick={closeSearch}
      ></div>

      <div className={`modal-wrapper ${isOpen ? "active" : ""}`}>
        <button className="close-x" onClick={closeSearch}>
          <X size={24} />
        </button>

        <div className="modal-title">¿Qué te apetece ver?</div>
        <div className="modal-sub">
          Elige una emoción o género y descubre nuevas recomendaciones.
        </div>

        {/* Barra de búsqueda */}
        <div className="search-row">
          <div className="search-input">
            <Search size={20} className="text-muted" color="#aeb3c2" />
            <input
              type="text"
              placeholder="Buscar serie o película..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setIsOpen(false);
                  navigate(`/resultados?q=${encodeURIComponent(e.target.value)}`);
                }
              }}
            />
          </div>
          <button className="search-btn" onClick={() => {
            const input = document.querySelector('.search-input input');
            if (input && input.value.trim()) {
              setIsOpen(false);
              navigate(`/resultados?q=${encodeURIComponent(input.value)}`);
            }
          }}>
            <Search size={24} />
          </button>
        </div>

        {/* BOTONES DE CATEGORÍA */}
        <div className="cat-grid">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className={`cat ${selectedCat === cat.key ? "selected" : ""}`}
              onClick={() => handleCategoryClick(cat.key)}
            >
              <div className="cat-icon">{cat.icon}</div>
              <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Busqueda;
