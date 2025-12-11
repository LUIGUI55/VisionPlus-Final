import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManageProfiles.css';

const AVATARS = ['😊', '😎', '🤓', '🥳', '🤠', '👨‍💼', '👩‍💼', '🧑‍🎓', '👶', '🐶', '🐱', '🦁'];

export default function ManageProfiles() {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState(null);
    const [formData, setFormData] = useState({ name: '', avatar: '😊', isKids: false });

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
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (profile) => {
        setEditingProfile(profile.id);
        setFormData({
            name: profile.name,
            avatar: profile.avatar,
            isKids: profile.isKids
        });
    };

    const cancelEdit = () => {
        setEditingProfile(null);
        setFormData({ name: '', avatar: '😊', isKids: false });
    };

    const saveProfile = async (profileId) => {
        if (!formData.name.trim()) {
            alert('El nombre es requerido');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/profiles/${profileId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            cancelEdit();
            loadProfiles();
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            alert('Error al actualizar el perfil');
        }
    };

    const deleteProfile = async (profileId) => {
        if (!confirm('¿Estás seguro de eliminar este perfil?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/profiles/${profileId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            loadProfiles();
        } catch (error) {
            console.error('Error eliminando perfil:', error);
            alert('Error al eliminar el perfil');
        }
    };

    if (loading) {
        return <div className="manage-profiles-page"><div className="loading">Cargando...</div></div>;
    }

    return (
        <div className="manage-profiles-page">
            <header className="manage-header">
                <h1>Administrar Perfiles</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate('/subscription')} className="btn-done" style={{ backgroundColor: '#e50914' }}>
                        Suscripción
                    </button>
                    <button onClick={() => navigate('/profiles')} className="btn-done">
                        Listo
                    </button>
                </div>
            </header>

            <main className="manage-main">
                <div className="profiles-list">
                    {profiles.map(profile => (
                        <div key={profile.id} className="profile-item">
                            {editingProfile === profile.id ? (
                                // Modo edición
                                <div className="profile-edit-form">
                                    <div className="edit-avatar">
                                        <div className="current-avatar">{formData.avatar}</div>
                                        <div className="avatar-grid">
                                            {AVATARS.map(avatar => (
                                                <div
                                                    key={avatar}
                                                    className={`avatar-option ${formData.avatar === avatar ? 'selected' : ''}`}
                                                    onClick={() => setFormData({ ...formData, avatar })}
                                                >
                                                    {avatar}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="edit-input"
                                        maxLength={30}
                                    />

                                    <label className="kids-toggle">
                                        <input
                                            type="checkbox"
                                            checked={formData.isKids}
                                            onChange={(e) => setFormData({ ...formData, isKids: e.target.checked })}
                                        />
                                        Perfil para niños
                                    </label>

                                    <div className="edit-actions">
                                        <button onClick={() => saveProfile(profile.id)} className="btn-save">
                                            Guardar
                                        </button>
                                        <button onClick={cancelEdit} className="btn-cancel">
                                            Cancelar
                                        </button>
                                        <button onClick={() => deleteProfile(profile.id)} className="btn-delete">
                                            Eliminar Perfil
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Modo vista
                                <div className="profile-view">
                                    <div className="profile-avatar-large">{profile.avatar}</div>
                                    <div className="profile-info">
                                        <h3>{profile.name}</h3>
                                        {profile.isKids && <span className="kids-badge">Niños</span>}
                                    </div>
                                    <button onClick={() => startEdit(profile)} className="btn-edit">
                                        ✏️ Editar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
