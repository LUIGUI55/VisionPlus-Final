import { Routes, Route, useNavigate } from "react-router-dom";

// PANTALLAS EXISTENTES
import VisionPlusNeon from "./pages/Landing/VisionPlusNeon.jsx";
import VisionPlusLogin from "./pages/Login/VisionPlusLogin.jsx";
import Register from "./pages/Register/Register.jsx";
import VisionPlusDetail from "./pages/src/components/VisionPlusDetail.jsx";
import Player from "./pages/Player/Player.jsx";
import MiLista from "./pages/Milista/MiLista.jsx";
import Busqueda from "./pages/Categorias/Busqueda.jsx";
import Resultados from "./pages/Categorias/Resultados.jsx";
import TipoContenido from "./pages/Categorias/TipoContenido.jsx";
import Inicio from "./pages/Inicio/Inicio.jsx";
import VisionPlusPlan from "./pages/Plan/VisionPlusPlan.jsx";
import VisionPlusChangePassword from "./pages/Password/VisionPlusChangePassword.jsx";
import VisionPlusPayment from "./pages/Pago/VisionPlusPayment.jsx";

// ⚠️ ESTO FALTABA
import VisionPlusPerfil from "./pages/Perfil/VisionPlusPerfil.jsx";
import VisionPlusNotifications from "./pages/Notificaciones/VisionPlusNotifications.jsx";

function App() {
  const navigate = useNavigate();
  const navigateToSearch = () => navigate("/busqueda");

  return (
    <Routes>

      {/* PANTALLA 1 */}
      <Route path="/" element={<VisionPlusNeon />} />

      {/* PLAN */}
      <Route path="/planes" element={<VisionPlusPlan />} />

      {/* PAGO */}
      <Route path="/pago/:plan" element={<VisionPlusPayment />} />

      {/* LOGIN */}
      <Route path="/login" element={<VisionPlusLogin />} />

      {/* CAMBIAR CONTRASEÑA */}
      <Route path="/changepassword" element={<VisionPlusChangePassword />} />

      {/* REGISTRO */}
      <Route path="/register" element={<Register />} />

      {/* INICIO */}
      <Route path="/inicio" element={<Inicio />} />

      {/* DETALLE */}
      <Route path="/detail/:id" element={<VisionPlusDetail />} />

      {/* PLAYER */}
      <Route path="/ver/:videoId" element={<Player />} />

      {/* MI LISTA */}
      <Route
        path="/milista"
        element={<MiLista navigateToSearch={navigateToSearch} />}
      />

      {/* CATEGORÍAS */}
      <Route path="/busqueda" element={<Busqueda />} />
      <Route path="/resultados" element={<Resultados />} />
      <Route path="/tipocontenido" element={<TipoContenido />} />

      {/* ⚠️ ESTO ES LO QUE HACÍA FALTA */}
      <Route path="/perfil" element={<VisionPlusPerfil />} />
      <Route path="/notificaciones" element={<VisionPlusNotifications />} />

    </Routes>
  );
}

export default App;
