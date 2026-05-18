import React, { useState, useEffect, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
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
    const [refreshing, setRefreshing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [tempAvatar, setTempAvatar] = useState(null);
    const [tempBanner, setTempBanner] = useState(null);

    useEffect(() => {
        
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
        setRefreshing(true);
        
        try {
            const config = { 
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } 
            };
            
            const response = await axios.get(`http://127.0.0.1:8000/fibonacci/products/`, config);
            
            let productsArray = [];
            
            if (Array.isArray(response.data)) {
                productsArray = response.data;
            } else if (response.data.products && Array.isArray(response.data.products)) {
                productsArray = response.data.products;
            } else if (response.data.results && Array.isArray(response.data.results)) {
                productsArray = response.data.results;
            } else if (response.data.data && Array.isArray(response.data.data)) {
                productsArray = response.data.data;
            }
            
            const filteredProducts = productsArray.filter(product => {
                if (product.user) {
                    if (typeof product.user === 'object') {
                        return product.user.id === userId || product.user._id === userId;
                    } else if (typeof product.user === 'string' || typeof product.user === 'number') {
                        return String(product.user) === String(userId);
                    }
                }
                
                if (product.user_id) {
                    return String(product.user_id) === String(userId);
                }
                
                if (product.artist_id) {
                    return String(product.artist_id) === String(userId);
                }
                
                if (product.owner) {
                    return String(product.owner) === String(userId);
                }
                
                return false;
            });
            
            console.log("Produtos filtrados:", filteredProducts); 
            setUserProducts(filteredProducts);
            
        } catch (e) {
            console.error("Erro ao carregar obras:", e);
            setUserProducts([]);
        } finally {
            setRefreshing(false);
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

    // Função para gerar imagem aleatória 
    const getRandomArtImage = (width, height, seed) => {
        // Usa o Lorem Picsum com seed aleatório baseado no timestamp + seed
        const randomSeed = Math.random() * 1000000;
        return `https://picsum.photos/seed/${seed || randomSeed}/${width}/${height}`;
    };

    const getArtAvatar = () => {
        if (tempAvatar) return tempAvatar;
        if (userInfo?.avatar && userInfo.avatar !== '') return userInfo.avatar;

        const randomNum = Math.floor(Math.random() * 1000);
        return `https://picsum.photos/id/${randomNum}/400/400`;
    };

    const getArtBanner = () => {
        if (tempBanner) return tempBanner;
        if (userInfo?.banner && userInfo.banner !== '') return userInfo.banner;
       
        const randomNum = Math.floor(Math.random() * 1000) + 100;
        return `https://picsum.photos/id/${randomNum}/1200/400`;
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
            
            const updatedUser = { ...data, token: token };
            setUserInfo(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            
            setEditName(data.name || editName);
            setEditBio(data.bio || editBio);
            setEditLocation(data.location || editLocation);
            
            setIsEditing(false);
            setShowSuccessModal(true);
           
            await fetchUserProfile(token);
            const userId = updatedUser.id || updatedUser._id;
            await fetchUserProducts(userId, token);
            
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            alert(`Erro ao salvar alterações: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handleProductClick = (productId) => {
        console.log("Navegando para obra:", productId);
        history.push(`/product/${productId}`);
    };

    if (!userInfo) return null;

    return (
        <div className="profile-page animate-fade-in">

            <div className={`profile-banner-container ${isEditing ? 'editing-active' : ''}`} 
                 onClick={() => isEditing && fileInputBanner.current.click()}>
                <img src={getArtBanner()} alt="Banner de Arte" className="profile-banner" 
                     onError={(e) => {
                         e.target.src = `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/1200/400`;
                     }} />
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
                    <img src={getArtAvatar()} alt="Avatar de Arte" className="profile-avatar"
                         onError={(e) => {
                             e.target.src = `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/400/400`;
                         }} />
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
                            
                            <Link to="/adicionar-obra" className="btn-add-artwork-profile" title="Adicionar nova obra">
                                <span className="plus-icon">+</span> Adicionar Obra
                            </Link>

                            <button className="btn-logout-minimal" onClick={() => { localStorage.removeItem('userInfo'); history.push('/login'); }}>Sair</button>
                        </>
                    )}
                </div>

                <div className="profile-tabs">
                    <div className="profile-tab-header">
                        <div className={`profile-tab ${activeTab === 'obras' ? 'active' : ''}`} onClick={() => setActiveTab('obras')}>
                            Minhas Obras
                        </div>
                        <button 
                            className="refresh-btn"
                            onClick={() => {
                                const userId = userInfo.id || userInfo._id;
                                const token = userInfo.token || userInfo.access;
                                fetchUserProducts(userId, token);
                            }}
                            disabled={refreshing}
                        >
                            {refreshing ? "🔄" : "🔄"}
                        </button>
                    </div>
                </div>

                <div className="profile-content-body">
                    <div className="profile-grid">
                        {userProducts.length > 0 ? userProducts.map(p => {
                            
                            const productId = p.id || p._id;
                            console.log("Produto:", p.name, "ID:", productId); 
                            
                            return (
                                <div 
                                    className="profile-art-card" 
                                    key={productId}
                                    onClick={() => handleProductClick(productId)}
                                >
                                    <div className="art-card-image-wrapper">
                                        <img 
                                            src={p.image} 
                                            alt={p.name} 
                                            className="art-card-image"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x400?text=Sem+Imagem';
                                            }}
                                        />
                                        <div className="art-card-overlay">
                                            <span className="view-details">Ver Detalhes</span>
                                        </div>
                                    </div>
                                    <div className="art-card-info">
                                        <h3 className="art-card-title">{p.name}</h3>
                                        <p className="art-card-price">
                                            R$ {typeof p.price === 'number' ? p.price.toFixed(2) : p.price}
                                        </p>
                                        {p.category && <span className="art-card-category">{p.category}</span>}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="empty-state">
                                <div className="empty-icon">🎨</div>
                                <h3>Nenhuma obra cadastrada</h3>
                                <p>Comece adicionando sua primeira obra de arte!</p>
                                <Link to="/adicionar-obra" className="empty-add-btn">
                                    + Adicionar Obra
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content animate-pop-in">
                        <div className="modal-icon-success">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h2>Perfil Atualizado!</h2>
                        <p>Suas informações foram salvas com sucesso. Seu perfil agora reflete sua identidade artística.</p>
                        <button className="btn-modal-confirm" onClick={closeSuccessModal}>
                            Continuar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;