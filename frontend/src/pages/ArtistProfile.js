import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/profile.css';

function ArtistProfile() {
    const history = useHistory();
    const { id } = useParams();

    const [artistInfo, setArtistInfo] = useState(null);
    const [artistProducts, setArtistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
               
                const storedUser = localStorage.getItem('userInfo');
                let config = {};

                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    const token = user.token || user.access;
                    
                    if (token) {
                        config = {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        };
                    }
                }

                const { data: artistsData } = await axios.get('http://127.0.0.1:8000/fibonacci/users/artists/', config);
                
                const artist = artistsData.find(a => String(a.id) === String(id));
                
                if (artist) {
                    setArtistInfo({
                        id: artist.id,
                        name: artist.first_name ? `${artist.first_name} ${artist.last_name || ''}` : artist.username,
                        username: artist.username,
                        location: artist.profile?.location,
                        bio: artist.profile?.bio,
                        avatar: artist.profile?.profile_image,
                        banner: artist.profile?.banner_image
                    });
                } else {
                    setError('Artista não encontrado na nossa base de dados.');
                }

                const { data: productsData } = await axios.get(`http://127.0.0.1:8000/fibonacci/products/`, config);
                
                let productsArray = [];
                if (Array.isArray(productsData)) productsArray = productsData;
                else if (productsData.products) productsArray = productsData.products;
                else if (productsData.results) productsArray = productsData.results;
                else if (productsData.data) productsArray = productsData.data;

                const filteredProducts = productsArray.filter(product => {
                    if (product.user && typeof product.user === 'object') return String(product.user.id) === String(id);
                    if (product.user) return String(product.user) === String(id);
                    if (product.user_id) return String(product.user_id) === String(id);
                    if (product.artist_id) return String(product.artist_id) === String(id);
                    return false;
                });

                setArtistProducts(filteredProducts);
                setLoading(false);

            } catch (err) {
                console.error("Erro ao carregar os dados do artista:", err);
                
                if (err.response && err.response.status === 401) {
                    setError('Sua sessão expirou ou você precisa fazer login para visualizar o catálogo deste artista.');
                } else {
                    setError('Erro ao carregar o perfil do artista. Tente novamente mais tarde.');
                }
                
                setLoading(false);
            }
        };

        fetchArtistData();
    }, [id]);

    const handleProductClick = (productId) => {
        history.push(`/product/${productId}`);
    };

    const getArtAvatar = () => {
        if (!artistInfo?.avatar) {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(artistInfo?.name || 'Artista')}&background=5D4037&color=fff&size=150`;
        }
        return artistInfo.avatar.startsWith('http') ? artistInfo.avatar : `http://127.0.0.1:8000${artistInfo.avatar}`;
    };

    const getArtBanner = () => {
        if (!artistInfo?.banner) {
            return 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop';
        }
        return artistInfo.banner.startsWith('http') ? artistInfo.banner : `http://127.0.0.1:8000${artistInfo.banner}`;
    };

    if (loading) return <div className="profile-page"><div className="empty-state"><h3>Carregando perfil...</h3></div></div>;
    
    if (error) return (
        <div className="profile-page">
            <div className="empty-state">
                <h3>{error}</h3>
                {error.includes('login') ? (
                    <button onClick={() => history.push('/login')} className="btn-profile-primary" style={{marginTop: '15px'}}>Fazer Login</button>
                ) : (
                    <button onClick={() => history.push('/artistas')} className="btn-logout-minimal" style={{marginTop: '15px'}}>Voltar para Artistas</button>
                )}
            </div>
        </div>
    );
    
    if (!artistInfo) return null;

    return (
        <div className="profile-page animate-fade-in">
            <div className="profile-banner-container">
                <img src={getArtBanner()} alt={`Banner de ${artistInfo.name}`} className="profile-banner" />
            </div>

            <div className="profile-header-content">
                <div className="avatar-wrapper">
                    <img src={getArtAvatar()} alt={`Avatar de ${artistInfo.name}`} className="profile-avatar" />
                </div>

                <div className="profile-info-section">
                    <h1 className="profile-name">{artistInfo.name}</h1>
                    <p className="profile-location">
                        <i className="fas fa-map-marker-alt"></i> {artistInfo.location || "Local não informado"}
                    </p>
                    <p className="profile-bio">{artistInfo.bio || "Este artista ainda não adicionou uma descrição biográfica."}</p>
                </div>

                <div className="profile-tabs" style={{ marginTop: '30px' }}>
                    <div className="profile-tab-header">
                        <div className="profile-tab active">
                            Obras do Artista ({artistProducts.length})
                        </div>
                    </div>
                </div>

                <div className="profile-content-body">
                    <div className="profile-grid">
                        {artistProducts.length > 0 ? (
                            artistProducts.map(p => {
                                const productId = p.id || p._id;
                                return (
                                    <div 
                                        className="profile-art-card" 
                                        key={productId}
                                        onClick={() => handleProductClick(productId)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="art-card-image-wrapper">
                                            <img 
                                                src={p.image} 
                                                alt={p.name} 
                                                className="art-card-image"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=400';
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
                            })
                        ) : (
                            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                                <div className="empty-icon">🎨</div>
                                <h3>Nenhuma obra disponível</h3>
                                <p>Este artista ainda não possui obras publicadas no catálogo.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArtistProfile;