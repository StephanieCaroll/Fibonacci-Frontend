import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../styles/categorysection.css';

const API_BASE = 'http://127.0.0.1:8000';

const DEFAULT_CATEGORIES = [
    {
        name: 'Fotografia',
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80'
    },
    {
        name: 'Pintura',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=80'
    },
    {
        name: 'Escultura',
        image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=900&q=80'
    },
    {
        name: 'Gravura',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80'
    },
    {
        name: 'Desenho',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80'
    }
];

function CategorySection({ onSelectCategory }) {
    const history = useHistory();
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const scrollRef = useRef(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data } = await axios.get(`${API_BASE}/api/products/categories/`);
                const apiCategories = Array.isArray(data) ? data.filter(cat => cat?.name) : [];

                if (apiCategories.length > 0) {
                    setCategories(apiCategories.map((cat, index) => ({
                        ...DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length],
                        ...cat
                    })));
                }
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
                setCategories(DEFAULT_CATEGORIES);
            }
        }

        fetchCategories();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const getImageUrl = (image) => {
        if (!image) return DEFAULT_CATEGORIES[0].image;
        if (image.startsWith('http') || image.startsWith('data:') || image.startsWith('blob:')) return image;
        return `${API_BASE}${image.startsWith('/') ? image : `/${image}`}`;
    };

    const handleCategoryClick = (categoryName) => {
        if (typeof onSelectCategory === 'function') {
            onSelectCategory(categoryName);
            return;
        }

        history.push(`/galeria?categoria=${encodeURIComponent(categoryName.toLowerCase())}`);
    };

    return (
        <section className="category-container-main">
            <div className="category-header-flex">
                <div>
                    <span className="overline">Curadoria</span>
                    <h2>Explore as Categorias</h2>
                </div>
                <div className="carousel-nav-buttons">
                    <button onClick={() => scroll('left')} aria-label="Anterior">
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button onClick={() => scroll('right')} aria-label="Próximo">
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div className="category-carousel-wrapper" ref={scrollRef}>
                {categories.map((cat) => (
                    <button
                        type="button"
                        key={cat._id || cat.id || cat.name}
                        className="category-post-card"
                        onClick={() => handleCategoryClick(cat.name)}
                    >
                        <img
                            src={getImageUrl(cat.image)}
                            alt={cat.name}
                            className="category-post-img"
                        />
                        <div className="category-post-overlay">
                            <div>
                                <h3>{cat.name}</h3>
                                <p>{cat.count ? `${cat.count} Obras` : 'Ver curadoria'}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}

export default CategorySection;
