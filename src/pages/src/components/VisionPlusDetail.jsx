import { useNavigate } from "react-router-dom";
import "./VisionPlusDetail.css";

export default function VisionPlusDetail() {
  const navigate = useNavigate();

  return (
    <>

      <header className="inicio-navbar header">
        <div className="inicio-logo brand">
          VISIONPLUS
        </div>

        <nav className="inicio-nav">
          <a className="active">Inicio</a>
          <a onClick={() => navigate("/MiLista")} style={{ cursor: "pointer" }}>Mi lista</a>
        </nav>

        <div className="inicio-search-box" onClick={() => navigate("/busqueda")}>
          <input
            type="text"
            placeholder="Buscar..."
            onFocus={() => navigate("/busqueda")}
            readOnly
          />
          <button>🔍</button>
        </div>

        <div className="inicio-user">
          <div onClick={() => navigate("/perfil")} style={{ cursor: "pointer" }}>
            Perfil
          </div>
          <div onClick={() => navigate("/notificaciones")} style={{ cursor: "pointer" }}>
            Notificaciones
          </div>
        </div>
      </header>

      <main className="wrap">
        <div className="grid">
          { }
          <aside className="left">
            <figure className="poster">
              <img src="" alt="Poster" />
            </figure>
            <div className="actions">
              <button className="act-btn">➕ Agregar a… <small>Mi lista</small></button>
            </div>
          </aside>


          <section>
            <header className="panel detail-hero">
              <div className="bg" style={{ backgroundImage: "url('')" }}></div>
              <div className="title">
                <h1>Prueba</h1><span className="year">(2025)</span>
              </div>
              <div className="meta-row">
                <span className="rating"><span className="dot"></span> 56% • 98 min • HD</span>
                <span className="pill">Terror</span>
                <span className="pill">Suspense</span>
                <span className="pill">EN / LAT</span>
              </div>
              <p className="syn">Descripcion</p>
            </header>

            <div className="bar">
              <div className="row">
                <div className="tag"><span className="dot"></span> Latino <small style={{ opacity: .7 }}>CALIDAD HD</small></div>
                <div className="tag"><span className="dot"></span> Descargar <small style={{ opacity: .7 }}>CALIDAD HD</small></div>
              </div>
            </div>

            <div className="player" onClick={() => navigate("/ver/strangers2")}>
              <div className="ph"></div>
            </div>

            <section className="features">
            </section>

           
          </section>

          { }
          <aside className="aside">
            <div className="panel list">
              <div className="tabs">
                <button className="tab active">Actualizado</button>
                <button className="tab">Últimas</button>
              </div>  
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}