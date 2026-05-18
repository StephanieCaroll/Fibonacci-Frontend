import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import '../styles/galeria.css';

function Galeria() {
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    const [categoryFilter, setCategoryFilter] = useState('todas');
    const [styleFilter, setStyleFilter] = useState('todos');
    const [priceFilter, setPriceFilter] = useState(Infinity);
    const [sortOrder, setSortOrder] = useState('recent');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                
                const { data } = await axios.get('http://127.0.0.1:8000/fibonacci/products/');
                
                setProducts(data.products || []);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar galeria:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleBuyClick = (e, productId) => {
        e.preventDefault();
        const userInfo = localStorage.getItem('userInfo');
        
        if (userInfo) {
          
            history.push(`/product/${productId}`); 
        } else {
           
            history.push(`/login?redirect=product/${productId}`);
        }
    };

    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product => {
            const nome = (product.name || '').toLowerCase();
            const artista = (product.brand || '').toLowerCase();
            const categoria = (product.category_name || 'pintura').toLowerCase(); 
            const preco = parseFloat(product.price || 0);

            const matchSearch = nome.includes(searchTerm.toLowerCase()) || artista.includes(searchTerm.toLowerCase());
            const matchCat = categoryFilter === 'todas' || categoria === categoryFilter;
            const matchEstilo = styleFilter === 'todos' || true; 
            const matchPrice = preco <= priceFilter;

            return matchSearch && matchCat && matchEstilo && matchPrice;
        });

        // Lógica de Ordenação
        if (sortOrder === 'price-asc') {
            filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortOrder === 'price-desc') {
            filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortOrder === 'recent') {
            filtered.sort((a, b) => b._id - a._id); 
        }

        return filtered;
    }, [products, searchTerm, categoryFilter, styleFilter, priceFilter, sortOrder]);

    return (
        <div className="animate-fade-in">
           
            <section className="galeria-hero">
                <div className="galeria-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-main-title">Galeria</h1>
                    <p className="hero-subtitle">Explore obras únicas de artistas locais</p>
                </div>
            </section>

            <div className="container mt-5 mb-5">
                <div className="mb-4">
                    <small className="text-muted text-uppercase" style={{ letterSpacing: '2px' }}>Coleção</small>
                    <h2 className="font-weight-bold" style={{ fontFamily: 'Playfair Display' }}>Obras da Galeria</h2>
                </div>

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
                            <button 
                                type="button" 
                                className="btn-filtros-clean" 
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <i className="fas fa-sliders-h"></i> FILTROS
                            </button>
                            <button type="button" className="btn-buscar-submit">BUSCAR</button>
                        </div>
                    </div>
                </div>

                {showFilters && (
                    <div className="mb-5 filters-panel animate-fade-in">
                        <div className="filter-grid">
                            
                            <div className="filter-col">
                                <h6>CATEGORIA</h6>
                                <div className="pill-group">
                                    {['todas', 'pintura', 'desenho', 'fotografia', 'escultura'].map(cat => (
                                        <button 
                                            key={cat}
                                            className={`pill ${categoryFilter === cat ? 'active' : ''}`}
                                            onClick={() => setCategoryFilter(cat)}
                                        >
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-col">
                                <h6>ESTILO / GÊNERO</h6>
                                <div className="pill-group">
                                    {['todos', 'barroco', 'romântico', 'moderno', 'contemporâneo'].map(est => (
                                        <button 
                                            key={est}
                                            className={`pill ${styleFilter === est ? 'active' : ''}`}
                                            onClick={() => setStyleFilter(est)}
                                        >
                                            {est.charAt(0).toUpperCase() + est.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-col">
                                <h6>PREÇO</h6>
                                <div className="pill-group">
                                    <button className={`pill ${priceFilter === Infinity ? 'active' : ''}`} onClick={() => setPriceFilter(Infinity)}>Todos</button>
                                    <button className={`pill ${priceFilter === 500 ? 'active' : ''}`} onClick={() => setPriceFilter(500)}>Até R$500</button>
                                    <button className={`pill ${priceFilter === 1500 ? 'active' : ''}`} onClick={() => setPriceFilter(1500)}>Até R$1.5k</button>
                                </div>
                            </div>

                            <div className="filter-col">
                                <h6>ORDENAR</h6>
                                <select 
                                    className="filter-select-mini" 
                                    value={sortOrder} 
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="recent">Mais Recentes</option>
                                    <option value="price-asc">Menor Preço</option>
                                    <option value="price-desc">Maior Preço</option>
                                </select>
                            </div>

                        </div>
                    </div>
                )}

              
                {loading ? (
                    <div className="text-center py-5"><h5 className="text-muted">Carregando galeria...</h5></div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-5"><h5 className="text-muted">Nenhuma obra encontrada para esta busca.</h5></div>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                        {filteredProducts.map((product) => (
                            <div className="col mb-4 card-item" key={product._id}>
                                <div className="card-obra">
                                    <span className="badge-categoria text-uppercase">
                                        {product.category_name || 'Obra'}
                                    </span>
                                    <Link to={`/product/${product._id}`}>
                                        <img 
                                            src={`http://127.0.0.1:8000${product.image}`} 
                                            className="obra-img" 
                                            alt={product.name} 
                                        />
                                    </Link>
                                    <div className="pt-3">
                                        <h6 className="mb-0 font-weight-bold text-uppercase nome-obra">
                                            {product.name}
                                        </h6>
                                        <small className="text-muted artista-obra">
                                            {product.brand || 'Artista Local'}
                                        </small>
                                        <br/>
                                       
                                        <button 
                                            onClick={(e) => handleBuyClick(e, product._id)} 
                                            className="btn-buy-now"
                                            style={{ background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
                                        >
                                            Comprar Agora
                                        </button>
                                        <p className="font-weight-bold mt-2 mb-0" style={{ color: '#5D4037', fontSize: '1.1rem' }}>
                                            R$ {product.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-5">
                    <button className="btn btn-outline-custom" style={{ padding: '12px 80px' }}>VER MAIS</button>
                </div>
            </div>
        </div>
    );
}

export default Galeria;