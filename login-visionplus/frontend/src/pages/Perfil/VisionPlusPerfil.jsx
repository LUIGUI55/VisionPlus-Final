import React from "react";
import { User, Edit2, Mail, Bell, Search } from "lucide-react";
export default function VisionPlusPerfil() {
  const [avatar, setAvatar] = React.useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <style>{`
:root{
 --bg-dark:#0b0f16;
 --text-light:#e5e7eb;
 --neon-purple:#9d4edd;
 --neon-violet:#7b2cbf;
}

*{box-sizing:border-box}
html,body{height:100%; width:100%}
body{
 margin:0;
 background:var(--bg-dark);
 color:var(--text-light);
 font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
 display: flex;
 justify-content: center;
 min-height: 100vh;
 flex-direction: column; 
}

/* Header */
.header{
 height:72px; display:grid; grid-template-columns: 220px 1fr 220px;
 align-items:center; gap:16px; padding:0 24px;
 background:linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,0));
 position:sticky; top:0; z-index:10;
}
.brand{
 font-weight:900; letter-spacing:.8px; font-size:1.5rem; white-space:nowrap;
 color:var(--neon-purple);
}
.nav{ display:flex; align-items:center; gap:20px; font-weight:700; }
.nav a{ color:#c9cbd1; text-decoration:none; padding:.4rem .6rem; border-radius:10px; transition:.2s; }
.nav a:hover{ color:var(--text-light); background:rgba(157,78,221,.15); }

/* Search */
.search{
 justify-self:center; display:flex; align-items:center; gap:8px;
 background:#0e131c; padding:6px 14px; border-radius:999px;
 border:1.6px solid #2a3344;
 width:min(480px, 90%);
}
.search input{
 flex:1; border:0; background:transparent; outline:none; color:var(--text-light);
 padding:.35rem .25rem; font-weight:600;
}
.search .icon{ color:var(--neon-purple); }

/* Actions */
.actions{ justify-self:end; display:flex; align-items:center; gap:18px; }
.actions a{
 color:var(--neon-purple); text-decoration:none; font-weight:700;
 display:flex; align-items:center; gap:8px;
}
.actions a:hover{ color:var(--neon-violet); }

/* Layout principal */
.container{
 width:min(1120px, 92%);
 margin-top: 24px;
 margin-bottom: 64px;
 border:1px solid #3b4454; border-radius:12px;
 padding:18px 18px 32px 18px;
}
.section-title{ font-weight:800; letter-spacing:.2px; margin:6px 8px 0 8px; }
.hr{ height:1px; background:#9ca3af44; margin:10px 0 16px 0 }

/* Panel de perfil */
.profile-grid{ display:grid; grid-template-columns: 1.1fr 1.4fr; gap:28px; }
@media (max-width: 880px){ .profile-grid{ grid-template-columns:1fr; } }

.card{
 border:1px solid #5a6476; border-radius:10px; padding:24px;
 background:rgba(26,30,38,.55);
 backdrop-filter: blur(2px);
}

/* Avatar */
.avatar{
 height:260px; border:1px solid #5a6476; border-radius:10px;
 display:grid; place-items:center; position:relative;
 overflow: hidden;
}
.avatar-img {
 width: 100%; height: 100%; object-fit: cover; position: absolute;
}
.avatar-placeholder {
 color: var(--neon-purple);
}

.edit-fab{
 position:absolute; bottom:18px; left:50%; transform:translateX(-50%);
 width:38px; height:38px; border-radius:10px; display:grid; place-items:center;
 background:#0f1420; border:1.5px solid #cfd3db88; cursor: pointer;
 transition: all 0.2s;
 z-index: 5;
}
.edit-fab:hover { background: var(--neon-purple); border-color: var(--neon-purple); }
.edit-fab svg{ color:#e5e7eb; transition: color 0.2s; }
.edit-fab:hover svg { color: white; }

/* Form */
.form .group{ margin-bottom:18px }
.label{ color:#cbd5e1; font-weight:700; margin:0 0 8px 4px; display:block; }
.input{
 width:100%; padding:.9rem 1rem; border-radius:12px;
 background:#3a4252cc; border:2px solid #555e70; color:var(--text-light);
 outline:none; transition:.2s;
}
.input:focus{ border-color:var(--neon-purple); }
.inline-edit{
 position:absolute; right:14px; top:50%; transform:translateY(-50%);
 width:28px; height:28px; display:grid; place-items:center; cursor: pointer;
}
.inline-edit svg { color: #aaaaaa; transition: color 0.2s; }
.inline-edit:hover svg { color: white; }
.input-wrap{ position:relative }

/* Links */
.links{ margin-top:12px; display:grid; gap:10px; }
.links a{ color:var(--neon-purple); text-decoration:none; font-weight:700; }
.links a:hover{ color:var(--neon-violet); }
.danger{ color:#f87171 }

.hide-sm{ display:initial }
@media (max-width: 480px){ .hide-sm{ display:none } }
      `}</style>

      <header className="header">
        <div className="brand">VISIONPLUS</div>

        <form className="search" role="search" aria-label="Buscar" onSubmit={(e) => e.preventDefault()}>
          <input type="search" placeholder="Buscar" aria-label="Buscar" />
          <Search size={20} className="icon" />
        </form>

        <nav className="actions" aria-label="Acciones">
          <a href="#" aria-label="Perfil">
            <User size={22} />
            <span className="hide-sm">Perfil</span>
          </a>
          <a href="#" aria-label="Notificaciones">
            <Bell size={22} />
            <span className="hide-sm">Notificaciones</span>
          </a>
        </nav>
      </header>

      <main className="container">
        <div className="section-title">Mi Perfil</div>
        <div className="hr" role="separator" aria-hidden="true" />

        <div className="profile-grid">
          <section className="card avatar" aria-label="Avatar">
            {avatar ? (
              <img src={avatar} alt="Avatar de usuario" className="avatar-img" />
            ) : (
              <User size={120} className="avatar-placeholder" />
            )}

            <label className="edit-fab" aria-label="Editar avatar" title="Editar avatar">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <Edit2 size={18} />
            </label>
          </section>

          <section className="card form" aria-label="Formulario de perfil">
            <div className="group">
              <label className="label" htmlFor="nombre">Nombre</label>
              <div className="input-wrap">
                <input className="input" id="nombre" type="text" placeholder="Tu nombre" />
                <span className="inline-edit" title="Editar" aria-hidden="true">
                  <Edit2 size={18} />
                </span>
              </div>
            </div>

            <div className="group">
              <label className="label" htmlFor="apellido">Apellido</label>
              <div className="input-wrap">
                <input className="input" id="apellido" type="text" placeholder="Tu apellido" />
                <span className="inline-edit" title="Editar" aria-hidden="true">
                  <Edit2 size={18} />
                </span>
              </div>
            </div>

            <div className="group">
              <label className="label" htmlFor="email">Correo Electrónico</label>
              <div className="input-wrap">
                <input className="input" id="email" type="email" placeholder="correo@ejemplo.com" />
              </div>
            </div>

            <div className="links">
              <a href="#">Mi Plan</a>
              <a href="#">Cambiar Contraseña</a>
              <a className="danger" href="#">Eliminar cuenta</a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

