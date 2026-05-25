import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/categorysection.css';

function CategorySection({ onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data } = await axios.get('http://127.0.0.1:8000/api/products/categories/');
                setCategories(data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
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
                    <div 
                        key={cat._id || cat.id} 
                        className="category-post-card" 
                        onClick={() => onSelectCategory(cat.name.toLowerCase())}
                    >
                        <img 
                            src={cat.image.startsWith('http') ? cat.image : `http://127.0.0.1:8000${cat.image}`} 
                            alt={cat.name} 
                            className="category-post-img" 
                        />
                        <div className="category-post-overlay">
                            <h3>{cat.name}</h3>
                            <p>{cat.count ? `${cat.count} Obras` : 'Ver curadoria'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CategorySection;