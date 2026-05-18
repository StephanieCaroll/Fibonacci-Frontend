import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '../styles/profile.css';

function Profile() {
    const history = useHistory();
    const fileInputAvatar = useRef(null);
    const fileInputBanner = useRef(null);

    const [userInfo, setUserInfo] = useState(null);
    const [userProducts, setUserProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('obras');
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [tempAvatar, setTempAvatar] = useState(null);
    const [tempBanner, setTempBanner] = useState(null);

    useEffect(() => {
        // Busca países
        axios.get('https://restcountries.com/v3.1/all?fields=name,translations')
            .then(res => {
                const list = res.data.map(c => c.translations.por.common).sort();
                setCountries([...new Set(list)]);
            })
            .catch(() => setCountries(["Brasil", "Portugal", "Angola"]));

        const storedUser = localStorage.getItem('userInfo');
        if (!storedUser) {
            history.push('/login');
        } else {
            const user = JSON.parse(storedUser);
            setUserInfo(user);
            setEditName(user.name || user.username || '');
            setEditBio(user.bio || '');
            setEditLocation(user.location || '');
            setTempAvatar(user.avatar || null);
            setTempBanner(user.banner || null);
            fetchUserProducts(user.id || user._id, user.token || user.access);
        }
    }, [history]);

    const fetchUserProducts = async (userId, token) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`http://127.0.0.1:8000/fibonacci/products/`, config);
            const productsArray = Array.isArray(data) ? data : (data.results || []);
            setUserProducts(productsArray.filter(p => p.user === userId));
        } catch (e) {
            console.error("Erro ao carregar obras:", e);
        }
    };

    const fetchUserProfile = async (token) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`http://127.0.0.1:8000/fibonacci/users/profile/`, config);
            
            const updatedUser = { ...data, token: token };
            setUserInfo(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            
            setEditName(data.name || data.username || '');
            setEditBio(data.bio || '');
            setEditLocation(data.location || '');
            setTempAvatar(data.avatar || null);
            setTempBanner(data.banner || null);
            
            return data;
        } catch (error) {
            console.error("Erro ao buscar perfil:", error);
            return null;
        }
    };

    // Imagens artísticas baseadas no ID do usuário
    const getArtAvatar = () => {
        const id = userInfo?.id || "default";
        if (tempAvatar) return tempAvatar;
        if (userInfo?.avatar) return userInfo.avatar;
        return `https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&h=400&q=80&sig=${id}`;
    };

    const getArtBanner = () => {
        const id = userInfo?.id || "default";
        if (tempBanner) return tempBanner;
        if (userInfo?.banner) return userInfo.banner;
        return `https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1200&h=400&q=80&sig=${id}`;
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'avatar') setTempAvatar(reader.result);
                else setTempBanner(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProfile = async () => {
        setLoading(true);
        try {
            const token = userInfo.token || userInfo.access;
            const formData = new FormData();

            if (editName) formData.append('name', editName);
            if (editBio) formData.append('bio', editBio);
            if (editLocation) formData.append('location', editLocation);
            if (userInfo.email) formData.append('email', userInfo.email);
            
            if (fileInputAvatar.current && fileInputAvatar.current.files[0]) {
                formData.append('avatar', fileInputAvatar.current.files[0]);
            }
            
            if (fileInputBanner.current && fileInputBanner.current.files[0]) {
                formData.append('banner', fileInputBanner.current.files[0]);
            }
            
            console.log("Enviando dados:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
            }
            
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            const { data } = await axios.put(
                `http://127.0.0.1:8000/fibonacci/users/profile/update/`,
                formData,
                config
            );
            
            console.log("Resposta do servidor:", data);
            
            const updatedUser = { ...data, token: token };
            setUserInfo(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            
            setEditName(data.name || editName);
            setEditBio(data.bio || editBio);
            setEditLocation(data.location || editLocation);
            
            if (!data.avatar && tempAvatar) {
                updatedUser.avatar = tempAvatar;
            }
            if (!data.banner && tempBanner) {
                updatedUser.banner = tempBanner;
            }
            
            setIsEditing(false);
            alert("Perfil salvo com sucesso!");
           
            await fetchUserProfile(token);
            
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            console.error("Detalhes do erro:", error.response?.data);
            alert(`Erro ao salvar alterações: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) return null;

    return (
        <div className="profile-page animate-fade-in">

            <div className={`profile-banner-container ${isEditing ? 'editing-active' : ''}`} 
                 onClick={() => isEditing && fileInputBanner.current.click()}>
                <img src={getArtBanner()} alt="Banner" className="profile-banner" />
                {isEditing && (
                    <div className="banner-overlay-edit">
                        <i className="fas fa-camera"></i>
                        <span>Alterar Banner</span>
                    </div>
                )}
                <input type="file" ref={fileInputBanner} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
            </div>

            <div className="profile-header-content">
               
                <div className={`avatar-wrapper ${isEditing ? 'editing-active' : ''}`} 
                     onClick={() => isEditing && fileInputAvatar.current.click()}>
                    <img src={getArtAvatar()} alt="Avatar" className="profile-avatar" />
                    {isEditing && (
                        <div className="avatar-overlay-edit">
                            <i className="fas fa-pencil-alt"></i>
                            <span className="edit-label">Editar</span>
                        </div>
                    )}
                    <input type="file" ref={fileInputAvatar} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                </div>

                <div className="profile-info-section">
                    {isEditing ? (
                        <div className="edit-form-inline">
                            <input 
                                type="text" 
                                className="edit-input-h1" 
                                value={editName} 
                                onChange={(e) => setEditName(e.target.value)} 
                                placeholder="Nome do Artista" 
                            />
                            <select 
                                className="edit-input-p" 
                                value={editLocation} 
                                onChange={(e) => setEditLocation(e.target.value)}
                            >
                                <option value="">Selecione o País</option>
                                {countries.map((c, i) => (
                                    <option key={`${c}-${i}`} value={c}>{c}</option>
                                ))}
                            </select>
                            <textarea 
                                className="edit-input-bio" 
                                value={editBio} 
                                onChange={(e) => setEditBio(e.target.value)} 
                                placeholder="Sua biografia artística..." 
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="profile-name">{userInfo.name || userInfo.username}</h1>
                            <p className="profile-location">
                                <i className="fas fa-map-marker-alt"></i> {userInfo.location || "Local não informado"}
                            </p>
                            <p className="profile-bio">{userInfo.bio || "Nenhuma biografia informada."}</p>
                        </>
                    )}
                </div>

                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button className="btn-profile-primary" onClick={saveProfile} disabled={loading}>
                                {loading ? "Salvando..." : "Salvar"}
                            </button>
                            <button className="btn-logout-minimal" onClick={() => {
                                setIsEditing(false);
                                setEditName(userInfo.name || userInfo.username || '');
                                setEditBio(userInfo.bio || '');
                                setEditLocation(userInfo.location || '');
                                setTempAvatar(userInfo.avatar || null);
                                setTempBanner(userInfo.banner || null);
                            }}>Cancelar</button>
                        </>
                    ) : (
                        <>
                            <button className="btn-profile-primary" onClick={() => setIsEditing(true)}>Editar Perfil</button>
                            <button className="btn-logout-minimal" onClick={() => { localStorage.removeItem('userInfo'); history.push('/login'); }}>Sair</button>
                        </>
                    )}
                </div>

                <div className="profile-tabs">
                    <div className={`profile-tab ${activeTab === 'obras' ? 'active' : ''}`} onClick={() => setActiveTab('obras')}>Minhas Obras</div>
                </div>

                <div className="profile-content-body">
                    <div className="profile-grid">
                        {userProducts.length > 0 ? userProducts.map(p => (
                            <div className="profile-art-card" key={p.id || p._id}>
                                <img src={p.image} alt={p.name} />
                                <h3>{p.name}</h3>
                                <p>R$ {p.price}</p>
                            </div>
                        )) : (
                            <div className="empty-state">Nenhuma obra cadastrada até o momento.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;