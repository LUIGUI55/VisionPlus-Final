import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { moviesService } from "../../services/api.js";
import "./Resultados.css";

const Resultados = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    setIsOpen(true);

    // Parse search from URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("search");

    if (query) {
      async function fetchResults() {
        try {
          const results = await moviesService.searchMovies(query);
          // Map TMDB results to component format
          const mapped = results.map(doc => ({
            id: doc.id,
            titulo: doc.title || doc.name,
            img: doc.poster_path
              ? `https://image.tmdb.org/t/p/w500${doc.poster_path}`
              : "https://placehold.co/300x450/111111/FFFFFF?text=No+Image"
          }));
          setPeliculas(mapped);
        } catch (error) {
          console.error("Search failed", error);
        }
      }
      fetchResults();
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [location.search]);

  const closeResultados = () => {
    setIsOpen(false);
    setTimeout(() => {
      navigate(-1);
    }, 200);
  };

  const handleCardClick = (peliculaID) => {
    navigate(`/detail/${peliculaID}`);
  };

  return (
    <div className={`resultados-container ${isOpen ? "active" : ""}`}>
      <div className="resultados-overlay" onClick={closeResultados}></div>

      <div className="resultados-modal">
        <button className="resultados-close-x" onClick={closeResultados}>✕</button>

        <div className="resultados-title">Resultados de tu búsqueda</div>

        <div className="resultados-grid">
          {peliculas.length === 0 && <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>No se encontraron resultados.</p>}
          {peliculas.map((p, i) => (
            <div
              key={i}
              className="resultados-card"
              onClick={() => handleCardClick(p.id)}
            >
              <img src={p.img} alt={p.titulo} />
              <div className="resultados-card-info">
                <p>{p.titulo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resultados;