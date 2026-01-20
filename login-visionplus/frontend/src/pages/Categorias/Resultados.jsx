import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Resultados.css";

const Resultados = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    setIsOpen(true);
    const ejemploPeliculas = [
      { titulo: "Película A", img: "https://placehold.co/300x450/9d4edd/FFFFFF?text=A", id: "a" },
      { titulo: "Película B", img: "https://placehold.co/300x450/9d4edd/FFFFFF?text=B", id: "b" },
      { titulo: "Película C", img: "https://placehold.co/300x450/9d4edd/FFFFFF?text=C", id: "c" },
      { titulo: "Película D", img: "https://placehold.co/300x450/9d4edd/FFFFFF?text=D", id: "d" },
      { titulo: "Película E", img: "https://placehold.co/300x450/9d4edd/FFFFFF?text=E", id: "e" },
      { titulo: "Película F", img: "https://placehold.co/300x450/9d4edd/FFFFFF?text=E", id: "f" },
      
    ];
    setPeliculas(ejemploPeliculas);

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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