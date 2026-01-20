import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Resultados.css";
import { moviesService } from "../../services/api";

const Resultados = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [peliculas, setPeliculas] = useState([]);

  const [searchParams] = useSearchParams(); // Requires import
  const query = searchParams.get("q");

  useEffect(() => {
    setIsOpen(true);

    if (query) {
      const fetchResults = async () => {
        try {
          const results = await moviesService.searchMovies(query);
          // Mapeamos los resultados de TMDB para que tengan 'img' y 'titulo'
          const formatted = results.map(p => ({
            titulo: p.title || p.name, // TMDB usa 'title' para pelis, 'name' para series
            img: p.poster_path
              ? `https://image.tmdb.org/t/p/w300${p.poster_path}`
              : "https://placehold.co/300x450/111111/FFFFFF?text=No+Poster",
            id: p.id // ID de TMDB
          }));
          setPeliculas(formatted);
        } catch (error) {
          console.error("Error searching:", error);
          setPeliculas([]);
        }
      };
      fetchResults();
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [query]);

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