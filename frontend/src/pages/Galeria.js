import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useHistory, useLocation } from 'react-router-dom';
import '../styles/galeria.css';
import CategorySection from '../components/CategorySection';

function Galeria() {
    const history = useHistory();
    const location = useLocation();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    // Filtro inicial baseado na URL
    const query = new URLSearchParams(location.search);
    const catFromUrl = query.get('categoria') ? query.get('categoria').toLowerCase() : 'todas';
    
    const [categoryFilter, setCategoryFilter] = useState(catFromUrl);
    const [styleFilter, setStyleFilter] = useState('todos');
    const [priceFilter, setPriceFilter] = useState(Infinity);
    const [sortOrder, setSortOrder] = useState('recent');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = userInfo ? {
                    headers: { Authorization: `Bearer ${userInfo.token || userInfo.access}` }
                } : {};

                const { data } = await axios.get('http://127.0.0.1:8000/fibonacci/products/', config);
                const productsData = data.products ? data.products : data;
                setProducts(Array.isArray(productsData) ? productsData : []);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar galeria:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleCardClick = (id) => {
        history.push(`/product/${id}`);
    };

    const getCategoryDisplay = (product) => {
        if (!product) return 'Arte';
        
        let cat = 'Arte';
        if (product.category_name) {
            cat = product.category_name;
        } else if (product.category && typeof product.category === 'object' && product.category.name) {
            cat = product.category.name;
        } else if (typeof product.category === 'string' && isNaN(Number(product.category))) {
            cat = product.category;
        }

        const catString = String(cat);
        if (catString.toLowerCase() === 'digital') return 'Arte Digital';
        return catString;
    };

    const addToCart = async (product) => {
    try {
        // Exemplo: chamando sua API ou atualizando o estado global do carrinho
        // await axios.post('http://127.0.0.1:8000/api/cart/', { product_id: product.id, quantity: 1 });
        
        alert(`${product.name} adicionado ao carrinho!`);
        // Aqui você pode disparar um evento para abrir um modal de sucesso se desejar
    } catch (error) {
        console.error("Erro ao adicionar ao carrinho:", error);
    }
};

    const getGenreFromDesc = (desc) => {
        if (!desc) return '';
        const match = desc.match(/Gênero:\s*([^.]+)/i);
        if (match && match[1]) {
            return match[1].trim().toLowerCase();
        }
        return '';
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const nome = (product.name || '').toLowerCase();
            const artista = (product.brand || '').toLowerCase();
            const categoria = (product.category_name || '').toLowerCase(); 
            const preco = parseFloat(product.price || 0);
            
            const generoExato = getGenreFromDesc(product.description);

            const matchSearch = nome.includes(searchTerm.toLowerCase()) || artista.includes(searchTerm.toLowerCase());
            const matchCat = categoryFilter === 'todas' || categoria === categoryFilter;
            const matchEstilo = styleFilter === 'todos' || generoExato === styleFilter.toLowerCase(); 
            const matchPrice = preco <= priceFilter;

            return matchSearch && matchCat && matchEstilo && matchPrice;
        }).sort((a, b) => {
            if (sortOrder === 'price-asc') return parseFloat(a.price) - parseFloat(b.price);
            if (sortOrder === 'price-desc') return parseFloat(b.price) - parseFloat(a.price);
            return (b.id || b._id) - (a.id || a._id);
        });
    }, [products, searchTerm, categoryFilter, styleFilter, priceFilter, sortOrder]);

    return (
        <div className="animate-fade-in">
            <section className="galeria-hero">
                <div className="galeria-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-main-title">Galeria</h1>
                    <p className="hero-subtitle">Descubra o novo expoente da arte local</p>
                </div>
            </section>

            <div className="container mt-5 mb-5">
                {/* Componente integrado */}
                <CategorySection 
                    onSelectCategory={(catName) => {
                        setCategoryFilter(catName);
                        window.scrollTo({ top: 500, behavior: 'smooth' });
                    }} 
                />

                <div className="search-wrapper-inline mb-4">
                    <div className="search-form-clean">
                        <div className="search-input-group">
                            <i className="fas fa-search search-icon"></i>
                            <input 
                                type="text" 
                                placeholder="BUSCAR POR TÍTULO OU ARTISTA..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                        <div className="search-actions">
                            <button type="button" className="btn-filtros-clean" onClick={() => setShowFilters(!showFilters)}>
                                <i className="fas fa-sliders-h"></i> FILTROS
                            </button>
                        </div>
                    </div>
                </div>

                {showFilters && (
                    <div className="mb-5 filters-panel animate-fade-in">
                        <div className="filter-grid">
                            <div className="filter-col">
                                <h6>CATEGORIA</h6>
                                <div className="pill-group">
                                    {['todas', 'pintura', 'desenho', 'fotografia', 'escultura', 'digital', 'outros'].map(cat => (
                                        <button key={cat} className={`pill ${categoryFilter === cat ? 'active' : ''}`} onClick={() => setCategoryFilter(cat)}>
                                            {cat === 'digital' ? 'Arte Digital' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-col">
                                <h6>GÊNERO</h6>
                                <div className="pill-group">
                                    {['todos', 'barroco', 'romântico', 'moderno', 'contemporâneo', 'surrealismo', 'abstrato', 'realismo', 'impressionismo', 'minimalismo', 'outros'].map(est => (
                                        <button key={est} className={`pill ${styleFilter === est ? 'active' : ''}`} onClick={() => setStyleFilter(est)}>
                                            {est.charAt(0).toUpperCase() + est.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-col">
                                <h6>FAIXA DE PREÇO</h6>
                                <div className="pill-group">
                                    <button className={`pill ${priceFilter === Infinity ? 'active' : ''}`} onClick={() => setPriceFilter(Infinity)}>Todos</button>
                                    <button className={`pill ${priceFilter === 500 ? 'active' : ''}`} onClick={() => setPriceFilter(500)}>Até R$500</button>
                                    <button className={`pill ${priceFilter === 1500 ? 'active' : ''}`} onClick={() => setPriceFilter(1500)}>Até R$1.5k</button>
                                </div>
                            </div>

                            <div className="filter-col">
                                <h6>ORDENAR</h6>
                                <select className="filter-select-mini" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                    <option value="recent">Lançamentos</option>
                                    <option value="price-asc">Menor Preço</option>
                                    <option value="price-desc">Maior Preço</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                        {[...Array(8)].map((_, i) => (
                            <div className="col mb-4" key={i}>
                                <div className="skeleton-card">
                                    <div className="skeleton-img"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                        {filteredProducts.map((product) => {
                            const isOutOfStock = (product.countInstock || 0) <= 0;
                            return (
                                <div className="col mb-4" key={product.id || product._id}>
                                    <div 
                                        className={`card-obra ${isOutOfStock ? 'esgotado' : ''}`} 
                                        onClick={() => handleCardClick(product.id || product._id)}
                                        style={{ 
                                            cursor: 'pointer', 
                                            filter: isOutOfStock ? 'grayscale(100%)' : 'none',
                                            opacity: isOutOfStock ? 0.7 : 1,
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span className={`badge-categoria text-uppercase ${isOutOfStock ? 'bg-secondary' : ''}`}>
                                            {getCategoryDisplay(product)} {isOutOfStock && '- ESGOTADO'}
                                        </span>
                                        
                                        <div className="img-container">
                                            <img 
                                                src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} 
                                                className="obra-img" 
                                                alt={product.name} 
                                            />
                                        </div>
                                        <div className="pt-3">
                                            <h6 className="mb-0 font-weight-bold text-uppercase nome-obra">
                                                {product.name}
                                            </h6>
                                            <small className="text-muted artista-obra">
                                                {product.brand}
                                            </small>
                                            <button
                                            className="btn-add-mini"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(product);
                                                }}
                                                ></button>
                                            
                                            {}
                                            <div 
                                                className="price-and-action-container" 
                                                style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center', 
                                                    marginTop: '10px' 
                                                }}
                                            >
                                                <p className="font-weight-bold mb-0 price-text">
                                                    {isOutOfStock ? 'Indisponível' : `R$ ${product.price}`}
                                                </p>
                                                
                                                {!isOutOfStock && (
                                                    <button 
                                                        className="btn-add-mini" 
                                                        onClick={(e) => {
                                                            e.stopPropagation(); 
                                                        }}
                                                        style={{
                                                            background: '#f8f9fa',
                                                            border: '1px solid #ddd',
                                                            width: '35px',
                                                            height: '35px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Galeria;


