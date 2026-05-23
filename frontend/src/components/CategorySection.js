import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function CategorySection({ onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data } = await axios.get('/api/products/categories/');
                setCategories(data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        }
        fetchCategories();
    }, []);

    // Função para as setas de navegação
    const scroll = (direction) => {
        if (direction === 'left') {
            scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        } else {
            scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    return (
        <section className="category-container-main">
            <div className="category-header-flex">
                <h2>Explore as Categorias</h2>
                <div className="carousel-nav-buttons">
                    <button onClick={() => scroll('left')}><i className="fas fa-chevron-left"></i></button>
                    <button onClick={() => scroll('right')}><i className="fas fa-chevron-right"></i></button>
                </div>
            </div>

            <div className="category-carousel-wrapper" ref={scrollRef}>
                {categories.map((cat) => (
                    <div 
                        key={cat._id} 
                        className="category-post-card" 
                        onClick={() => onSelectCategory(cat.name.toLowerCase())}
                    >
                        <img src={cat.image} alt={cat.name} className="category-post-img" />
                        <div className="category-post-overlay">
                            <h3>{cat.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CategorySection;