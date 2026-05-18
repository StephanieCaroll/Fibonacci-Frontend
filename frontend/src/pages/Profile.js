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

    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [tempAvatar, setTempAvatar] = useState(null);
    const [tempBanner, setTempBanner] = useState(null);

    const randomAvatar = "https://picsum.photos/400?random=1";
    const randomBanner = "https://picsum.photos/1200/400?random=2";

    useEffect(() => {
        
        axios.get('https://restcountries.com/v3.1/all?fields=name,translations')
            .then(res => {
                const list = res.data.map(c => c.translations.por.common).sort();
                setCountries(list);
            })
            .catch(() => setCountries(["Brasil", "Portugal", "Angola"]));

        const storedUser = localStorage.getItem('userInfo');
        if (!storedUser) {
            history.push('/login');
        } else {
            const user = JSON.parse(storedUser);
            setUserInfo(user);
            resetEditFields(user);
            fetchUserProducts(user.id || user._id);
        }
    }, [history]);

    const resetEditFields = (user) => {
        setEditName(user.name || user.username);
        setEditBio(user.bio || "Nada a dizer");
        setEditLocation(user.location || "");
        setTempAvatar(user.avatar || null);
        setTempBanner(user.banner || null);
    };

    const fetchUserProducts = async (userId) => {
        try {
            const { data } = await axios.get(`http://127.0.0.1:8000/fibonacci/products/`);
            const productsArray = Array.isArray(data) ? data : (data.results || []);
            setUserProducts(productsArray.filter(p => p.user === userId));
        } catch (e) { 
            console.error("Erro ao carregar obras", e);
            setUserProducts([]);
        }
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
    try {
       
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        
        if (!storedUser || !storedUser.token) {
            alert("Sessão expirada. Por favor, faça login novamente.");
            history.push('/login');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                
                'Authorization': `Bearer ${storedUser.token}` 
            }
        };

        const { data } = await axios.put(
            `http://127.0.0.1:8000/fibonacci/users/profile/update/`,
            {
                name: editName,
                bio: editBio,
                location: editLocation,
                
            },
            config
        );

        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        setIsEditing(false);
        alert("Perfil atualizado com sucesso!");
        
    } catch (error) {
        console.error("Erro ao salvar perfil:", error.response);
        if (error.response && error.response.status === 403) {
            alert("Erro 403: Você não tem permissão ou o token expirou. Tente sair e entrar novamente.");
        } else {
            alert("Ocorreu um erro ao atualizar o perfil.");
        }
    }
};

    const cancelEditHandler = () => {
        resetEditFields(userInfo);
        setIsEditing(false);
    };

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push('/login');
    };

    if (!userInfo) return null;

    return (
        <div className="profile-page animate-fade-in">
    
            <div className={`profile-banner-container ${isEditing ? 'editing-active' : ''}`} 
                 onClick={() => isEditing && fileInputBanner.current.click()}>
                <img src={tempBanner || randomBanner} alt="Banner" className="profile-banner" />
                {isEditing && (
                    <div className="banner-overlay-edit">
                        <i className="fas fa-camera"></i>
                        <span>Alterar Banner</span>
                    </div>
                )}
                <input type="file" ref={fileInputBanner} hidden onChange={(e) => handleFileChange(e, 'banner')} />
            </div>

            <div className="profile-header-content">
               
                <div className={`avatar-wrapper ${isEditing ? 'editing-active' : ''}`} 
                     onClick={() => isEditing && fileInputAvatar.current.click()}>
                    <img src={tempAvatar || randomAvatar} alt="Perfil" className="profile-avatar" />
                    {isEditing && (
                        <div className="avatar-overlay-edit">
                            <i className="fas fa-pencil-alt"></i>
                            <span className="edit-label">Editar</span>
                        </div>
                    )}
                    <input type="file" ref={fileInputAvatar} hidden onChange={(e) => handleFileChange(e, 'avatar')} />
                </div>

                <div className="profile-info-section">
                    {isEditing ? (
                        <div className="edit-form-inline">
                            <input type="text" className="edit-input-h1" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nome do Artista" />
                            <select 
                                className="edit-input-p" 
                                value={editLocation} 
                                onChange={(e) => setEditLocation(e.target.value)}
                            >
                                <option value="">Selecione sua localização</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <textarea className="edit-input-bio" value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder="Sua biografia..." />
                        </div>
                    ) : (
                        <>
                            <h1 className="profile-name">{userInfo.name || userInfo.username}</h1>
                            <p className="profile-location">
                                <i className="fas fa-map-marker-alt"></i> {userInfo.location || "Local não informado"}
                            </p>
                            <p className="profile-bio">{userInfo.bio || "Nada a dizer"}</p>
                        </>
                    )}
                </div>

                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button className="btn-profile-primary" onClick={saveProfile}>Salvar Alterações</button>
                           
                            <button className="btn-logout-minimal" onClick={cancelEditHandler}>Cancelar</button>
                        </>
                    ) : (
                        <>
                            <button className="btn-profile-primary" onClick={() => setIsEditing(true)}>Editar Perfil</button>
                            <button className="btn-logout-minimal" onClick={logoutHandler}>Sair</button>
                        </>
                    )}
                </div>

                <div className="profile-tabs">
                    <div className={`profile-tab ${activeTab === 'obras' ? 'active' : ''}`} onClick={() => setActiveTab('obras')}>Minhas Obras</div>
                    <div className={`profile-tab ${activeTab === 'favoritos' ? 'active' : ''}`} onClick={() => setActiveTab('favoritos')}>Favoritos</div>
                </div>

                <div className="profile-content-body">
                    {activeTab === 'obras' && (
                        <div className="profile-grid">
                            {userProducts.length > 0 ? userProducts.map(product => (
                                <div className="profile-art-card" key={product._id || product.id}>
                                    <img src={product.image} alt={product.name} />
                                    <h3>{product.name}</h3>
                                    <p>R$ {product.price}</p>
                                </div>
                            )) : (
                                <div className="empty-state">Nenhuma obra cadastrada ainda.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;