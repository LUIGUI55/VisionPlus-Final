import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VisionPlusPayment.css";

const PLAN_NAMES = {
  FREE: "Plan FREE",
  PREMIUM: "Plan PREMIUM",
  FAMILY: "Plan FAMILY",
};

export default function VisionPlusPayment() {
  const { plan } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState("card");


  const planKey = (plan || "").toUpperCase();

  const nombrePlan = useMemo(() => {
    return PLAN_NAMES[planKey] || "Plan seleccionado";
  }, [planKey]);

  const goToBusqueda = () => navigate("/busqueda");
  const goToPerfil = () => navigate("/perfil");
  const goToNotifications = () => navigate("/notificaciones");
  const goToPlanes = () => navigate("/planes");


  const handleSubmit = (e) => {
    e.preventDefault();

    if (method === "card") {
      alert("Pago con tarjeta procesado correctamente (demo)");
    } else if (method === "paypal") {
      alert("Serías redirigido a PayPal para completar el pago (demo)");
    } else if (method === "code") {
      alert("Código aplicado correctamente (demo)");
    }

    navigate("/inicio");
  };

  return (
    <div className="vpay-page">
      <header className="inicio-navbar">
        {/* LOGO */}
        <div className="inicio-logo brand" onClick={() => navigate("/inicio")} style={{ cursor: "pointer" }}>
          VISIONPLUS
        </div>

        {/* NAVEGACIÓN (Inicio / Mi Plan) */}
        <nav className="inicio-nav">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/inicio"); }}>
            Inicio
          </a>
          {/* El enlace a Mi plan está activo en esta página de pago */}
          <a
            href="#"
            className="active"
            onClick={(e) => { e.preventDefault(); goToPlanes(); }}
          >
            Mi plan
          </a>
        </nav>

        {/* BARRA DE BÚSQUEDA (El CSS maneja el margin: auto;) */}
        <div className="inicio-search-box" onClick={goToBusqueda}>
          <input
            type="text"
            placeholder="Buscar..."
            onFocus={goToBusqueda}
            readOnly
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToBusqueda();
            }}
          >
            🔍
          </button>
        </div>

        {/* ACCIONES DE USUARIO (Perfil / Notificaciones) */}
        {/* Se usa la clase 'inicio-user' tal como está definida en tu CSS */}
        <div className="inicio-user"> 
          <div onClick={goToPerfil} style={{ cursor: "pointer" }}>
            Perfil
          </div>
          <div onClick={goToNotifications} style={{ cursor: "pointer" }}>
            Notificaciones
          </div>
        </div>
      </header>

      <main className="vpay-main">
        <section className="vpay-panel">
          <header className="vpay-header">
            <h2>Forma de pago</h2>
            <p>
              Estás a un paso de activar <strong>{nombrePlan}</strong>. Ingresa
              tus datos de pago de forma segura.
            </p>
          </header>

          <div className="vpay-layout">
            {/* Resumen */}
            <aside className="vpay-summary">
              <h3>Resumen del plan</h3>
              <div className="vpay-summary-card">
                <div className="vpay-summary-title">{nombrePlan}</div>
                <ul>
                  <li>Acceso completo al catálogo</li>
                  <li>Calidad HD / 4K según el plan</li>
                  <li>Cancelación cuando quieras</li>
                </ul>
              </div>

              <button
                type="button"
                className="vpay-back"
                onClick={goToPlanes}
              >
                ← Cambiar de plan
              </button>
            </aside>

            {/* Form */}
            <section className="vpay-form-wrap">
              <form className="vpay-form" onSubmit={handleSubmit}>
                <div className="vpay-methods">
                  <button
                    type="button"
                    className={method === "card" ? "active" : ""}
                    onClick={() => setMethod("card")}
                  >
                    Tarjeta
                  </button>
                  <button
                    type="button"
                    className={method === "paypal" ? "active" : ""}
                    onClick={() => setMethod("paypal")}
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    className={method === "code" ? "active" : ""}
                    onClick={() => setMethod("code")}
                  >
                    Código
                  </button>
                </div>

                {/* CARD */}
                {method === "card" && (
                  <>
                    <div className="vpay-field">
                      <label>Nombre en la tarjeta</label>
                      <input
                        type="text"
                        placeholder="Como aparece en la tarjeta"
                        required
                      />
                    </div>

                    <div className="vpay-field">
                      <label>Número de tarjeta</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="vpay-row">
                      <div className="vpay-field">
                        <label>Vencimiento</label>
                        <input type="text" placeholder="MM/AA" required />
                      </div>
                      <div className="vpay-field">
                        <label>CVV</label>
                        <input type="password" placeholder="•••" required />
                      </div>
                    </div>

                    <div className="vpay-field">
                      <label>País / Región</label>
                      <select defaultValue="mx" required>
                        <option value="mx">México</option>
                        <option value="es">España</option>
                        <option value="ar">Argentina</option>
                        <option value="co">Colombia</option>
                      </select>
                    </div>
                  </>
                )}

                {/* PAYPAL */}
                {method === "paypal" && (
                  <>
                    <div className="vpay-field">
                      <label>Correo asociado a PayPal</label>
                      <input
                        type="email"
                        placeholder="tu-correo@ejemplo.com"
                        required
                      />
                    </div>

                    <p className="vpay-safe-text">
                      Al continuar, te redirigiremos a PayPal para que inicies
                      sesión y confirmes el pago.
                    </p>
                  </>
                )}

                {/* CODE */}
                {method === "code" && (
                  <>
                    <div className="vpay-field">
                      <label>Código de regalo / promoción</label>
                      <input
                        type="text"
                        placeholder="Ingresa tu código"
                        required
                      />
                    </div>

                    <p className="vpay-safe-text">
                      Si tu código es válido, se aplicará automáticamente al plan
                      seleccionado.
                    </p>
                  </>
                )}

                <button type="submit" className="vpay-submit">
                  {method === "card" && "Confirmar pago y continuar"}
                  {method === "paypal" && "Ir a PayPal y continuar"}
                  {method === "code" && "Canjear código y continuar"}
                </button>

                <p className="vpay-safe-text">
                  Tu información se procesa cifrada y de forma segura.
                </p>
              </form>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}