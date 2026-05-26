import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import '../styles/galeria.css';
import CategorySection from '../components/CategorySection';
import { CartContext } from '../context/CartContext';

const API_BASE = 'http://127.0.0.1:8000';

const normalizeText = (value = '') =>
    String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const getProductCategory = (product) => {
    if (!product) return '';
    if (product.category_name) return product.category_name;
    if (product.category && typeof product.category === 'object' && product.category.name) return product.category.name;
    if (typeof product.category === 'string' && isNaN(Number(product.category))) return product.category;
    return '';
};

const categoryMatches = (product, filter) => {
    if (filter === 'todas') return true;

    const category = normalizeText(getProductCategory(product));
    if (filter === 'digital') return category === 'digital' || category === 'arte digital';
    return category === filter;
};

function Galeria() {
    const history = useHistory();
    const location = useLocation();
    const { addToCart: addItemToCart } = useContext(CartContext);

    const categoryFromUrl = useMemo(() => {
        const query = new URLSearchParams(location.search);
        return normalizeText(query.get('categoria') || 'todas') || 'todas';
    }, [location.search]);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState(categoryFromUrl);
    const [styleFilter, setStyleFilter] = useState('todos');
    const [priceFilter, setPriceFilter] = useState(Infinity);
    const [sortOrder, setSortOrder] = useState('recent');

    useEffect(() => {
        setCategoryFilter(categoryFromUrl);
    }, [categoryFromUrl]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = userInfo ? {
                    headers: { Authorization: `Bearer ${userInfo.token || userInfo.access}` }
                } : {};

                const { data } = await axios.get(`${API_BASE}/fibonacci/products/`, config);
                const productsData = data.products ? data.products : data;
                setProducts(Array.isArray(productsData) ? productsData : []);
            } catch (error) {
                console.error('Erro ao carregar galeria:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleCardClick = (id) => {
        history.push(`/product/${id}`);
    };

    const getProductId = (product) => product.id || product._id;

    const getCategoryDisplay = (product) => {
        const category = getProductCategory(product) || 'Arte';
        const normalized = normalizeText(category);

        if (normalized === 'digital' || normalized === 'arte digital') return 'Arte Digital';
        return String(category).charAt(0).toUpperCase() + String(category).slice(1);
    };

    const getGenreFromDesc = (desc) => {
        if (!desc) return '';
        const match = desc.match(/G(?:ê|e|Ãª)nero:\s*([^.]+)/i);
        return match && match[1] ? normalizeText(match[1]) : '';
    };

    const getProductImage = (product) => {
        if (!product?.image) return 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=800&q=80';
        if (product.image.startsWith('http') || product.image.startsWith('data:') || product.image.startsWith('blob:')) return product.image;
        return `${API_BASE}${product.image.startsWith('/') ? product.image : `/${product.image}`}`;
    };

    const selectCategory = (category) => {
        const normalizedCategory = normalizeText(category || 'todas') || 'todas';
        const query = new URLSearchParams(location.search);

        if (normalizedCategory === 'todas') {
            query.delete('categoria');
        } else {
            query.set('categoria', normalizedCategory);
        }

        setCategoryFilter(normalizedCategory);
        history.push({
            pathname: '/galeria',
            search: query.toString() ? `?${query.toString()}` : ''
        });
        window.scrollTo({ top: 500, behavior: 'smooth' });
    };

    const addToCart = (product, event) => {
        event.stopPropagation();

        if ((product.countInstock || 0) <= 0) {
            alert('Esta obra está esgotada.');
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            history.push('/login?redirect=/galeria');
            return;
        }

        addItemToCart({
            _id: getProductId(product),
            id: getProductId(product),
            name: product.name,
            brand: product.brand || 'Artista Local',
            price: Number(product.price || 0),
            image: product.image,
            qty: 1,
            countInstock: product.countInstock
        });

        alert(`${product.name} foi adicionado ao carrinho.`);
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const name = normalizeText(product.name || '');
            const artist = normalizeText(product.brand || '');
            const price = parseFloat(product.price || 0);
            const genre = getGenreFromDesc(product.description);
            const search = normalizeText(searchTerm);

            const matchSearch = !search || name.includes(search) || artist.includes(search);
            const matchCategory = categoryMatches(product, categoryFilter);
            const matchStyle = styleFilter === 'todos' || genre === normalizeText(styleFilter);
            const matchPrice = price <= priceFilter;

            return matchSearch && matchCategory && matchStyle && matchPrice;
        }).sort((a, b) => {
            if (sortOrder === 'price-asc') return parseFloat(a.price || 0) - parseFloat(b.price || 0);
            if (sortOrder === 'price-desc') return parseFloat(b.price || 0) - parseFloat(a.price || 0);
            return Number(getProductId(b) || 0) - Number(getProductId(a) || 0);
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
                <CategorySection onSelectCategory={selectCategory} />

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
                                    {['todas', 'pintura', 'desenho', 'fotografia', 'escultura', 'gravura', 'digital', 'outros'].map(cat => (
                                        <button key={cat} className={`pill ${categoryFilter === cat ? 'active' : ''}`} onClick={() => selectCategory(cat)}>
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
                            const productId = getProductId(product);
                            const isOutOfStock = (product.countInstock || 0) <= 0;

                            return (
                                <div className="col mb-4" key={productId}>
                                    <div
                                        className={`card-obra ${isOutOfStock ? 'esgotado' : ''}`}
                                        onClick={() => handleCardClick(productId)}
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
                                                src={getProductImage(product)}
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
                                                        type="button"
                                                        className="btn-add-mini"
                                                        onClick={(event) => addToCart(product, event)}
                                                        title="Adicionar ao carrinho"
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
