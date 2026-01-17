import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";

export default function VisionPlusPerfil() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Funciones de Navegación ---
  function goToBusqueda() { navigate("/busqueda"); }
  function goToPerfil() { navigate("/perfil"); }
  function goToNotifications() { navigate("/notificaciones"); }
  function goToInicio() { navigate("/inicio"); }
  function goToMiLista() { navigate("/milista"); }
  
  function goToPlan() { navigate("/planes"); }
  function goToChangePassword() { navigate("/changepassword"); }

  // --- Lógica de la Modal ---
  function openDeleteModal() { setIsModalOpen(true); }
  function closeDeleteModal() { setIsModalOpen(false); }

  function confirmDeleteAccount() {
    // Aquí iría la lógica real para eliminar la cuenta (Ej: llamar a un API)
    console.log("Cuenta eliminada permanentemente.");
    closeDeleteModal();
    
    // CORRECCIÓN: Redirigir a la página de inicio o landing page (/)
    navigate("/"); 
  }

  return (
    <div className="perfil-page">

      <header className="perfil-topbar">
        <div className="perfil-brand brand">VISIONPLUS</div>

        <nav className="perfil-nav">
          <a onClick={goToInicio} style={{ cursor: "pointer" }}>
            Inicio
          </a>
          <a onClick={goToMiLista} style={{ cursor: "pointer" }}>
            Mi lista
          </a>
        </nav>

        <div className="perfil-search-box" onClick={goToBusqueda}>
          <input
            type="text"
            placeholder="Buscar..."
            onFocus={goToBusqueda}
            readOnly
          />
          <button>🔍</button>
        </div>

        <div className="perfil-user right">
          <div onClick={goToPerfil} className="active" style={{ cursor: "pointer" }}>
            Perfil
          </div>
          <div onClick={goToNotifications} style={{ cursor: "pointer" }}>
            Notificaciones
          </div>
        </div>
      </header>

      <main className="perfil-main-card"> 
        <div className="section-title">Mi Perfil</div>
        <div className="hr" role="separator" aria-hidden="true" />

        <div className="profile-grid">
          <section className="card avatar" aria-label="Avatar">
            <svg className="svg" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="8" aria-hidden="true">
              <circle cx="60" cy="42" r="20" />
              <path d="M22,98 Q60,72 98,98" strokeLinecap="round"/>
            </svg>
            <button className="edit-fab" aria-label="Editar avatar" title="Editar avatar" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5l4 4L7 21l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
          </section>

          <section className="card form" aria-label="Formulario de perfil">
            <div className="group">
              <label className="label" htmlFor="nombre">Nombre</label>
              <div className="input-wrap">
                <input className="input" id="nombre" type="text" placeholder="Tu nombre" defaultValue="Tu nombre" />
                <span className="inline-edit" title="Editar" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2">
                    <path d="M12 20h9"/><path d="M16.5 3.5l4 4L7 21l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </span>
              </div>
            </div>

            <div className="group">
              <label className="label" htmlFor="apellido">Apellido</label>
              <div className="input-wrap">
                <input className="input" id="apellido" type="text" placeholder="Tu apellido" defaultValue="Tu apellido" />
                <span className="inline-edit" title="Editar" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2">
                    <path d="M12 20h9"/><path d="M16.5 3.5l4 4L7 21l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </span>
              </div>
            </div>

            <div className="group">
              <label className="label" htmlFor="email">Correo Electrónico</label>
              <div className="input-wrap">
                <input className="input" id="email" type="email" placeholder="correo@ejemplo.com" defaultValue="correo@ejemplo.com" readOnly />
              </div>
            </div>

            <div className="links">
              <a onClick={goToPlan} style={{cursor: 'pointer'}}>Mi Plan</a>
              <a onClick={goToChangePassword} style={{cursor: 'pointer'}}>Cambiar Contraseña</a>
              <a className="danger" onClick={openDeleteModal} style={{cursor: 'pointer'}}>Eliminar cuenta</a>
            </div>
          </section>
        </div>
      </main>

      {/* --- Ventana Modal de Confirmación --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar tu cuenta permanentemente? Esta acción no se puede deshacer.</p>
            <div className="modal-buttons">
              <button className="modal-btn modal-cancel" onClick={closeDeleteModal}>
                Cancelar
              </button>
              <button className="modal-btn modal-delete" onClick={confirmDeleteAccount}>
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}