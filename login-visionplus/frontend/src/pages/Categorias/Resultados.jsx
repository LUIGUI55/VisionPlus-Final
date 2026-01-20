import { moviesService } from "../../services/api.js";

const Resultados = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [peliculas, setPeliculas] = useState([]);

  useEffect(() => {
    setIsOpen(true);

    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("q");

    if (query) {
      async function fetchResults() {
        const results = await moviesService.searchMovies(query);
        // Map TMDB results to local format if needed, or use directly if adaptable
        // Assuming TMDB returns { title, poster_path, id }
        const mapped = results.map(m => ({
          titulo: m.title,
          img: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "https://placehold.co/300x450/333/FFF?text=No+Image",
          id: m.id
        }));
        setPeliculas(mapped);
      }
      fetchResults();
    } else {
      // Fallback or empty
      setPeliculas([]);
    }

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