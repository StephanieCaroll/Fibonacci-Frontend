import React, { useState, useEffect, useRef } from 'react';
import { useHistory, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/profile.css';
 

 function Profile({ defaultTab = 'obras' }) {
    const history = useHistory();
    const routeLocation = useLocation();
    const fileInputAvatar = useRef(null);
    const fileInputBanner = useRef(null);

    const getActiveTabFromRoute = () => {
        const queryTab = new URLSearchParams(routeLocation.search).get('tab');
        return queryTab === 'compras' ? 'compras' : defaultTab;
    };

    const [userInfo, setUserInfo] = useState(null);
    const [userProducts, setUserProducts] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState(getActiveTabFromRoute);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [editName, setEditName] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editLocation, setEditLocation] = useState('');
    const [tempAvatar, setTempAvatar] = useState(null);
    const [tempBanner, setTempBanner] = useState(null);

    const defaultArtAvatars = [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&h=400&q=80',
        'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?auto=format&fit=crop&w=400&h=400&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&h=400&q=80',
        'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=400&h=400&q=80',
        'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=400&h=400&q=80',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=400&h=400&q=80',
        'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=400&h=400&q=80',
        'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=400&h=400&q=80'
    ];

    const defaultArtBanners = [
        'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1200&h=400&q=80',
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&h=400&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&h=400&q=80',
        'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1200&h=400&q=80',
        'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&h=400&q=80'
    ];

    const getRandomDefaultImage = (type) => {
        if (type === 'avatar') {
            const randomIndex = Math.floor(Math.random() * defaultArtAvatars.length);
            return defaultArtAvatars[randomIndex];
        } else {
            const randomIndex = Math.floor(Math.random() * defaultArtBanners.length);
            return defaultArtBanners[randomIndex];
        }
    };

    const getMediaUrl = (path, fallback = defaultArtAvatars[0]) => {
        if (!path) return fallback;
        if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
        return `http://127.0.0.1:8000${path.startsWith('/') ? path : `/${path}`}`;
    };

    const changeTab = (tab) => {
        setActiveTab(tab);
        history.replace(tab === 'compras' ? '/compras' : '/perfil-artista');
    };

    useEffect(() => {
        const queryTab = new URLSearchParams(routeLocation.search).get('tab');
        setActiveTab(queryTab === 'compras' ? 'compras' : defaultTab);
    }, [routeLocation.search, defaultTab]);

    const saveDefaultImagesToBackend = async (user, token) => {
        try {
            const avatarUrl = getRandomDefaultImage('avatar');
            const bannerUrl = getRandomDefaultImage('banner');
            
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            
            await axios.put(
                `http://127.0.0.1:8000/fibonacci/users/profile/update/`,
                { avatar: avatarUrl, banner: bannerUrl },
                config
            );
            
            const updatedUser = { ...user, avatar: avatarUrl, banner: bannerUrl };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            return updatedUser;
            
        } catch (error) {
            console.error("Erro ao salvar imagens no backend:", error);
            return user;
        }
    };

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
            
            const checkAndSetDefaultImages = async () => {
                let currentUser = user;
                
                if (!user.avatar || user.avatar === '' || !user.banner || user.banner === '') {
                    try {
                        const config = { headers: { Authorization: `Bearer ${user.token || user.access}` } };
                        const { data } = await axios.get(`http://127.0.0.1:8000/fibonacci/users/profile/`, config);
                        
                        if (!data.avatar || data.avatar === '' || !data.banner || data.banner === '') {
                            const updatedUser = await saveDefaultImagesToBackend(user, user.token || user.access);
                            currentUser = updatedUser;
                        } else {
                            currentUser = { ...user, avatar: data.avatar, banner: data.banner };
                            localStorage.setItem('userInfo', JSON.stringify(currentUser));
                        }
                    } catch (error) {
                        const updatedUser = await saveDefaultImagesToBackend(user, user.token || user.access);
                        currentUser = updatedUser;
                    }
                }
                
                setUserInfo(currentUser);
                setEditName(currentUser.name || currentUser.username || '');
                setEditBio(currentUser.bio || '');
                setEditLocation(currentUser.location || '');
                setTempAvatar(currentUser.avatar || null);
                setTempBanner(currentUser.banner || null);
                
                const token = currentUser.token || currentUser.access;
                fetchUserProducts(currentUser.id || currentUser._id, token);
                fetchUserOrders(token);
            };
            
            checkAndSetDefaultImages();
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
            
            setUserProducts(filteredProducts);
            
        } catch (e) {
            console.error("Erro ao carregar obras:", e);
            if (e.response && e.response.status === 401) {
                localStorage.removeItem('userInfo');
                history.push('/login');
            }
            setUserProducts([]);
        } finally {
            setRefreshing(false);
        }
    };

    const fetchUserOrders = async (token) => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://127.0.0.1:8000/fibonacci/orders/myorders/', config);
        
        console.log('📦 Pedidos recebidos do backend:', data);
        setUserOrders(data);
    } catch (error) {
        console.error("Erro ao carregar compras:", error);

    
        if (error.response && error.response.status === 401) {
            console.warn("Sessão expirada. Redirecionando para login...");
            
            localStorage.removeItem('userInfo');
          
            history.push('/login');
        }
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

    const getArtAvatar = () => {
        if (tempAvatar) return tempAvatar;
        if (userInfo?.avatar && userInfo.avatar !== '') return userInfo.avatar;
        return defaultArtAvatars[0];
    };

    const getArtBanner = () => {
        if (tempBanner) return tempBanner;
        if (userInfo?.banner && userInfo.banner !== '') return userInfo.banner;
        return defaultArtBanners[0];
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
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('userInfo');
                history.push('/login');
            }
            alert(`Erro ao salvar alterações: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handleProductClick = (productId) => {
        if (productId) {
            console.log('🎯 Navegando para produto ID:', productId);
            history.push(`/product/${productId}`);
        } else {
            console.error('❌ Tentativa de navegar sem productId');
        }
    };

    const extractProductId = (item) => {
       
        if (item.product) {
            if (typeof item.product === 'object') {
                return item.product._id || item.product.id;
            }
            if (typeof item.product === 'string' || typeof item.product === 'number') {
                return item.product;
            }
        }
        if (item.productId) return item.productId;
        if (item.product_id) return item.product_id;
        if (item._id && item._id !== item.order) return item._id;
        return null;
    };

    if (!userInfo) return null;

    return (
        <div className="profile-page animate-fade-in">
            <div className={`profile-banner-container ${isEditing ? 'editing-active' : ''}`} 
                 onClick={() => isEditing && fileInputBanner.current.click()}>
                <img src={getArtBanner()} alt="Banner de Arte" className="profile-banner" 
                     onError={(e) => {
                         e.target.src = defaultArtBanners[0];
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
                             e.target.src = defaultArtAvatars[0];
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
                        <div className={`profile-tab ${activeTab === 'obras' ? 'active' : ''}`} onClick={() => changeTab('obras')}>
                            Minhas Obras
                        </div>
                        <div className={`profile-tab ${activeTab === 'compras' ? 'active' : ''}`} onClick={() => changeTab('compras')}>
                            Minhas Compras
                        </div>
                        <button 
                            className="refresh-btn"
                            onClick={() => {
                                const userId = userInfo.id || userInfo._id;
                                const token = userInfo.token || userInfo.access;
                                fetchUserProducts(userId, token);
                                fetchUserOrders(token);
                            }}
                            disabled={refreshing}
                        >
                            {refreshing ? "🔄" : "🔄"}
                        </button>
                    </div>
                </div>

                <div className="profile-content-body">
                    {activeTab === 'obras' ? (
                        <div className="profile-grid">
                            {userProducts.length > 0 ? userProducts.map(p => {
                                const productId = p.id || p._id;
                                return (
                                    <div 
                                        className="profile-art-card" 
                                        key={productId}
                                        onClick={() => handleProductClick(productId)}
                                    >
                                        <div className="art-card-image-wrapper">
                                            <img 
                                                src={getMediaUrl(p.image)} 
                                                alt={p.name} 
                                                className="art-card-image"
                                                onError={(e) => {
                                                    e.target.src = defaultArtAvatars[0];
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
                    ) : (
                        <div className="orders-list">
                            {userOrders.length > 0 ? userOrders.map(order => (
                                <div key={order._id} className="order-item-card">
                                    <div className="order-header">
                                        <span className="order-id">Pedido #{String(order._id).slice(-8)}</span>
                                        <span className="order-date">📅 {new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                                        <span className="order-total">💰 Total: R$ {order.totalPrice}</span>
                                    </div>
                                    <div className="order-products-mini-grid">
                                        {order.orderItems && order.orderItems.map(item => {
                                            // Extrai o ID do produto corretamente
                                            const productId = extractProductId(item);
                                            
                                            // Log para debug (remova depois que funcionar)
                                            console.log('Item da compra:', {
                                                nome: item.name,
                                                productId: productId,
                                                dadosCompletos: item
                                            });
                                            
                                            return (
                                                <div 
                                                    key={item._id} 
                                                    className="purchased-product-card"
                                                    onClick={() => {
                                                        if (productId) {
                                                            handleProductClick(productId);
                                                        } else {
                                                            console.error('❌ Produto sem ID:', item);
                                                            alert(`Não foi possível abrir os detalhes de "${item.name}". ID do produto não encontrado.`);
                                                        }
                                                    }}
                                                >
                                                    <img 
                                                        src={getMediaUrl(item.image)} 
                                                        alt={item.name} 
                                                        className="purchased-product-image"
                                                        onError={(e) => {
                                                            e.target.src = defaultArtAvatars[0];
                                                        }}
                                                    />
                                                    <div className="purchased-product-info">
                                                        <p className="purchased-product-name">{item.name}</p>
                                                        <div className="purchased-product-details">
                                                            <small>📦 Qtd: {item.qty}</small>
                                                            <small>💰 R$ {item.price}</small>
                                                        </div>
                                                        <span className="purchased-product-link">
                                                            {productId ? 'Clique para ver detalhes →' : 'ID não disponível'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )) : (
                                <div className="empty-state">
                                    <div className="empty-icon">🛍️</div>
                                    <h3>Você ainda não fez compras</h3>
                                    <p>Explore a galeria e comece sua coleção de arte!</p>
                                    <Link to="/galeria" className="empty-add-btn">
                                        Ir para Galeria
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
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
