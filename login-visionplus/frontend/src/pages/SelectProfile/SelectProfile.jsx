import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SelectProfile.css';

const AVATARS = ['😊', '😎', '🤓', '🥳', '🤠', '👨‍💼', '👩‍💼', '🧑‍🎓', '👶', '🐶', '🐱', '🦁'];

export default function SelectProfile() {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newProfile, setNewProfile] = useState({ name: '', avatar: '😊', isKids: false });

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/profiles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfiles(response.data);
        } catch (error) {
            console.error('Error cargando perfiles:', error);
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const selectProfile = (profile) => {
        localStorage.setItem('activeProfile', JSON.stringify(profile));
        console.log('✅ Perfil seleccionado:', profile.name);
        navigate('/catalogo');
    };

    const createProfile = async () => {
        if (!newProfile.name.trim()) {
            alert('El nombre del perfil es requerido');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/profiles', newProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowCreateForm(false);
            setNewProfile({ name: '', avatar: '😊', isKids: false });
            loadProfiles();
        } catch (error) {
            console.error('Error creando perfil:', error);
            alert(error.response?.data?.message || 'Error al crear el perfil');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="select-profile-page">
                <div className="loading">Cargando perfiles...</div>
            </div>
        );
    }

    return (
        <div className="select-profile-page">
            <header className="profile-header">
                <div className="brand">VISIONPLUS</div>
                <button className="btn-logout" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </header>

            <main className="profile-main">
                <h1>¿Quién está viendo?</h1>

                <div className="profiles-grid">
                    {profiles.map(profile => (
                        <div
                            key={profile.id}
                            className="profile-card"
                            onClick={() => selectProfile(profile)}
                        >
                            <div className="profile-avatar">
                                {profile.avatar.startsWith('http') ? (
                                    <img src={profile.avatar} alt={profile.name} className="avatar-image" />
                                ) : (
                                    profile.avatar
                                )}
                            </div>
                            <div className="profile-name">{profile.name}</div>
                            {profile.isKids && <div className="kids-badge">Niños</div>}
                        </div>
                    ))}

                    {profiles.length < 5 && (
                        <div
                            className="profile-card profile-add"
                            onClick={() => setShowCreateForm(true)}
                        >
                            <div className="profile-avatar">➕</div>
                            <div className="profile-name">Agregar Perfil</div>
                        </div>
                    )}
                </div>

                {profiles.length > 0 && (
                    <button
                        className="btn-manage"
                        onClick={() => navigate('/profiles/manage')}
                    >
                        Administrar Perfiles
                    </button>
                )}
            </main>

            {showCreateForm && (
                <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Crear Nuevo Perfil</h2>

                        <div className="form-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={newProfile.name}
                                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                                placeholder="Ej: Juan, Niños, etc."
                                maxLength={30}
                            />
                        </div>

                        <div className="form-group">
                            <label>Avatar</label>
                            <div className="avatar-type-selector">
                                <button
                                    type="button"
                                    className={`type-btn ${!newProfile.avatar.startsWith('http') ? 'active' : ''}`}
                                    onClick={() => setNewProfile({ ...newProfile, avatar: '😊' })}
                                >
                                    😊 Emoji
                                </button>
                                <button
                                    type="button"
                                    className={`type-btn ${newProfile.avatar.startsWith('http') ? 'active' : ''}`}
                                    onClick={() => setNewProfile({ ...newProfile, avatar: 'https://' })}
                                >
                                    🖼️ Imagen URL
                                </button>
                            </div>

                            {newProfile.avatar.startsWith('http') ? (
                                <div>
                                    <input
                                        type="url"
                                        value={newProfile.avatar}
                                        onChange={(e) => setNewProfile({ ...newProfile, avatar: e.target.value })}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        className="url-input"
                                    />
                                    <small className="input-hint">
                                        💡 Puedes usar enlaces de Google Drive, Imgur, etc.
                                    </small>
                                    {newProfile.avatar && newProfile.avatar.length > 10 && (
                                        <div className="avatar-preview">
                                            <img
                                                src={newProfile.avatar}
                                                alt="Preview"
                                                onError={(e) => e.target.src = ''}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="avatar-selector">
                                    {AVATARS.map(avatar => (
                                        <div
                                            key={avatar}
                                            className={`avatar-option ${newProfile.avatar === avatar ? 'selected' : ''}`}
                                            onClick={() => setNewProfile({ ...newProfile, avatar })}
                                        >
                                            {avatar}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={newProfile.isKids}
                                    onChange={(e) => setNewProfile({ ...newProfile, isKids: e.target.checked })}
                                />
                                Perfil para niños
                            </label>
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => setShowCreateForm(false)}>
                                Cancelar
                            </button>
                            <button onClick={createProfile} className="btn-primary">
                                Crear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
