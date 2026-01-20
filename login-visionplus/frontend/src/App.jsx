import { Routes, Route, useNavigate } from "react-router-dom";

import VisionPlusNeon from "./pages/Landing/VisionPlusNeon.jsx";
import VisionPlusLogin from "./pages/Login/VisionPlusLogin.jsx";
import Register from "./pages/Register/Register.jsx";
import VisionPlusDetail from "./pages/src/components/VisionPlusDetail.jsx";
import PlayerPage from "./pages/src/pages/PlayerPage.jsx";
import MiLista from "./pages/Milista/MiLista.jsx";
import Busqueda from "./pages/Categorias/Busqueda.jsx";
import Resultados from "./pages/Categorias/Resultados.jsx";
import TipoContenido from "./pages/Categorias/TipoContenido.jsx";
import Inicio from "./pages/Inicio/Inicio.jsx";
import VisionPlusPlan from "./pages/Plan/VisionPlusPlan.jsx";
import VisionPlusChangePassword from "./pages/Password/VisionPlusChangePassword.jsx";
import VisionPlusPayment from "./pages/Pago/VisionPlusPayment.jsx";
import VisionPlusPerfil from "./pages/Perfil/VisionPlusPerfil.jsx";
import VisionPlusNotifications from "./pages/Notificaciones/VisionPlusNotifications.jsx";
import AddVideo from "./pages/Admin/AddVideo.jsx";

function App() {
  const navigate = useNavigate();
  const navigateToSearch = () => navigate("/busqueda");

  return (
    <Routes>
      <Route path="/" element={<VisionPlusNeon />} />
      <Route path="/planes" element={<VisionPlusPlan />} />
      <Route path="/pago/:plan" element={<VisionPlusPayment />} />
      <Route path="/login" element={<VisionPlusLogin />} />
      <Route path="/changepassword" element={<VisionPlusChangePassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/detail/:id" element={<VisionPlusDetail />} />
      <Route path="/ver/:id" element={<PlayerPage />} />
      <Route
        path="/milista"
        element={<MiLista navigateToSearch={navigateToSearch} />}
      />
      <Route path="/busqueda" element={<Busqueda />} />
      <Route path="/resultados" element={<Resultados />} />
      <Route path="/tipocontenido" element={<TipoContenido />} />
      <Route path="/perfil" element={<VisionPlusPerfil />} />
      <Route path="/notificaciones" element={<VisionPlusNotifications />} />
      <Route path="/admin/add-video" element={<AddVideo />} />

    </Routes>
  );
}

export default App;
