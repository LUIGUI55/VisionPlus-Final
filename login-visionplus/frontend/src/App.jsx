import { Routes, Route, Navigate } from 'react-router-dom';
import VisionPlusLogin from './pages/Login/VisionPlusLogin';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Inicio from './pages/Inicio/Inicio';
import SelectProfile from './pages/SelectProfile/SelectProfile';
import ManageProfiles from './pages/ManageProfiles/ManageProfiles';
import VisionPlusCatalogo from './pages/Catalogo/VisionPlusCatalogo';
import VideoPlayer from './pages/VideoPlayer/VideoPlayer';
import SubscriptionPage from './pages/SubscriptionPage';

// componente simple para verificar si el user esta logueado
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    console.log('ProtectedRoute - Token:', token ? 'Existe' : 'No existe');
    console.log('LocalStorage full:', JSON.stringify(localStorage));

    if (!token) {
        console.log('No hay token, redirigiendo a login');
        return <Navigate to="/" replace />;
    }

    console.log('Token válido, permitiendo acceso');
    return children;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<VisionPlusLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* ruta protegida */}
            <Route
                path="/inicio"
                element={
                    <ProtectedRoute>
                        <Inicio />
                    </ProtectedRoute>
                }
            />

            {/* selección de perfiles */}
            <Route
                path="/profiles"
                element={
                    <ProtectedRoute>
                        <SelectProfile />
                    </ProtectedRoute>
                }
            />

            {/* administrar perfiles */}
            <Route
                path="/profiles/manage"
                element={
                    <ProtectedRoute>
                        <ManageProfiles />
                    </ProtectedRoute>
                }
            />

            {/* catalogo de peliculas */}
            <Route
                path="/catalogo"
                element={
                    <ProtectedRoute>
                        <VisionPlusCatalogo />
                    </ProtectedRoute>
                }
            />

            {/* reproductor de video */}
            <Route
                path="/watch/:movieId"
                element={
                    <ProtectedRoute>
                        <VideoPlayer />
                    </ProtectedRoute>
                }
            />

            {/* suscripciones */}
            <Route
                path="/subscription"
                element={
                    <ProtectedRoute>
                        <SubscriptionPage />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
