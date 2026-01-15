
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PlayCircle, Plus } from "lucide-react";
import API_URL from "../../../config";

export default function VisionPlusDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/videos/details/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMovie(data);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: 40, textAlign: 'center' }}>Cargando...</div>;
  if (!movie) return <div style={{ color: 'white', padding: 40, textAlign: 'center' }}>Película no encontrada</div>;

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/300x450/1a1a1a/FFFFFF?text=No+Poster";

  return (
    <>
      <style>{`
/* ... (Estilos previos se mantienen, los comprimo para ahorrar espacio visual, pero se usarían los mismos) ... */
:root{ --bg:#0b0d13; --panel:#141925; --panel-2:#1a2030; --purple:#9d4edd; --purple-2:#7b2cbf; --glow:#c77dff; --text:#e8eaf0; --muted:#aeb3c2; --ok:#18c964; --warn:#ffc300; }
*{ box-sizing:border-box; }
html, body, #root { min-height: 100%; height: auto; }
html, body{ background-color:#0b0d13; margin:0; color:var(--text); font-family:"Nunito Sans",system-ui,sans-serif; background: radial-gradient(1200px 500px at 60% -10%, rgba(199,125,255,.14), transparent 60%), radial-gradient(800px 380px at -10% 120%, rgba(123,44,191,.10), transparent 60%), #0b0d13; background-attachment: fixed; }

.navbar{ position:sticky; top:0; z-index:100; display:flex; align-items:center; gap:18px; padding:10px 18px; background:linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,0)), var(--panel); border-bottom:1px solid rgba(199,125,255,.22); box-shadow:0 0 20px rgba(157,78,221,.15); }
.logo{ display:flex; align-items:center; gap:10px; font-weight:900; letter-spacing:.3px; color:var(--glow); font-size:18px; }
.menu{ display:flex; gap:12px; }
.menu a{ color:var(--text); text-decoration:none; font-weight:800; font-size:.95rem; padding:6px 8px; border-radius:10px; }
.menu a:hover{ background:rgba(199,125,255,.10); outline:1px solid rgba(199,125,255,.28); }

.wrap{ padding: clamp(12px,2.4vw,20px) 0; background: transparent !important; }
.grid{ display:grid; grid-template-columns: 220px 1fr 340px; gap:22px; align-items:start; max-width:1200px; margin: 0 auto; padding: 0 20px; }
.panel{ background:linear-gradient(180deg, rgba(255,255,255,.02), transparent 40%), var(--panel); border:1px solid rgba(199,125,255,.16); border-radius:14px; width:100%; box-shadow:0 8px 22px rgba(0,0,0,.45), 0 0 20px rgba(157,78,221,.08); }
.left{ position:sticky; top:86px; align-self:start; z-index:1; margin-left:0; }
.poster{ margin:0; width:100%; max-width:220px; aspect-ratio:3/4; border-radius:10px; overflow:hidden; background:var(--panel-2); border:1px solid rgba(199,125,255,.18); box-shadow:0 10px 24px rgba(0,0,0,.6); }
.poster img{ width:100%; height:100%; object-fit:cover; display:block; }
.actions{ margin-top:12px; padding:10px; background:var(--panel); border:1px solid rgba(199,125,255,.12); border-radius:10px; }
.act-btn{ width:100%; display:flex; align-items:center; justify-content:center; gap:10px; background:var(--panel-2); border:1px solid rgba(199,125,255,.16); border-radius:10px; padding:10px 12px; font-weight:800; color:var(--text); cursor:pointer; }
.act-btn:hover{ background:rgba(199,125,255,.2); }

.detail-hero{ position:relative; overflow:hidden; border-radius:14px; padding:18px 16px; min-height:clamp(320px, 50vh, 560px); display:flex; flex-direction:column; justify-content:flex-end; }
.detail-hero .bg{ position:absolute; inset:0; background:center/cover no-repeat; filter:saturate(1) brightness(.50); transform:scale(1.02); }
.detail-hero::after{ content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.18), rgba(0,0,0,.86)); }
.detail-hero>*{ position:relative; }
.title{ display:flex; align-items:baseline; gap:8px; flex-wrap:wrap;}
.title h1{ margin:0; font-size:clamp(24px,5vw,42px); }
.title .year{ opacity:.85; }
.meta-row{ display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin-top:8px; }
.pill{ display:inline-flex; align-items:center; gap:6px; padding:4px 8px; border-radius:999px; background:rgba(199,125,255,.10); border:1px solid rgba(199,125,255,.26); font-weight:800; font-size:.78rem; color:var(--glow); }

.syn{ margin:10px 0 0; color:#d9dbe4; font-style:italic; max-width:90ch; line-height:1.6; }

.player{ margin-top:18px; border-radius:14px; border:1px solid rgba(255,255,255,.08); padding:28px 12px; display:grid; place-items:center; cursor:pointer; transition:transform 0.2s; }
.player:hover { transform: scale(1.01); background: rgba(255,255,255,0.03); }
.player .ph{ width:min(560px, 85%); aspect-ratio:16/9; background:center / cover no-repeat; position:relative; border-radius:10px; box-shadow:0 8px 22px rgba(0,0,0,.45); filter: brightness(0.8); }
.player .ph::after{ content:"▶"; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:64px; height:64px; display:grid; place-items:center; border-radius:50%; background:rgba(0,0,0,.6); border:2px solid #fff; font-size:24px; color:#fff; }

@media (max-width:1000px){ .grid{ grid-template-columns:1fr; } .left{ display:none; } } /* Ocultar poster izq en movil */
      `}</style>

      <header className="navbar">
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><ArrowLeft /></button>
        <div className="logo">VISIONPLUS</div>
      </header>

      <main className="wrap">
        <div className="grid">

          {/* LEFT SIDEBAR (Desktop Only) */}
          <aside className="left">
            <figure className="poster">
              <img src={poster} alt={movie.title} />
            </figure>
            <div className="actions">
              <button className="act-btn">➕ Mi lista</button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <section>
            <header className="panel detail-hero">
              <div className="bg" style={{ backgroundImage: `url('${backdrop}')` }}></div>
              <div className="title">
                <h1>{movie.title || movie.name}</h1>
                <span className="year">({(movie.release_date || movie.first_air_date || '').split('-')[0]})</span>
              </div>
              <div className="meta-row">
                {movie.vote_average && <span className="pill">★ {movie.vote_average.toFixed(1)}</span>}
                {movie.runtime && <span className="pill">{movie.runtime} min</span>}
              </div>
              <p className="syn">{movie.overview}</p>
            </header>

            {/* PLAYER / EPISODES AREA */}
            {movie.isSeries ? (
              <div className="panel" style={{ marginTop: 18, padding: 20 }}>
                <h3>Episodios Disponibles</h3>
                {movie.episodes && movie.episodes.length > 0 ? (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {movie.episodes.map(ep => (
                      <div
                        key={ep.bunnyVideoId}
                        onClick={() => navigate(`/ver/${movie.id}?season=${ep.season}&episode=${ep.episode}`)}
                        style={{
                          padding: 15,
                          background: 'var(--panel-2)',
                          borderRadius: 8,
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          border: '1px solid rgba(199,125,255,.1)'
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>
                          T{ep.season} E{ep.episode}: {ep.title}
                        </span>
                        <PlayCircle color="var(--purple)" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#aaa', fontStyle: 'italic' }}>Próximamente...</p>
                )}
              </div>
            ) : (
              <div className="player" onClick={() => navigate(`/ver/${movie.id}`)}>
                <div className="ph" style={{ backgroundImage: `url('${backdrop}')` }}></div>
                <div style={{ marginTop: 10, fontWeight: 'bold', color: 'var(--purple)' }}>VER AHORA</div>
              </div>
            )}

            {/* CAST / DETAILS */}
            <section className="section" style={{ marginTop: 30 }}>
              <div className="panel" style={{ padding: 20 }}>
                <h3>Detalles</h3>
                <p><strong>Géneros:</strong> {movie.genres?.map(g => g.name).join(', ')}</p>
              </div>
            </section>
          </section>

          {/* RIGHT SIDEBAR (Recommendations or Similar - Static for now or remove) */}
          <aside className="aside">
            {/* ... Optional: Keep static list or remove ... */}
          </aside>

        </div>
      </main>
    </>
  );
}

