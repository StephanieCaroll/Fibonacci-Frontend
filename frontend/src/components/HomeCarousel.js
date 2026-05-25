import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/homeCarousel.css';

function HomeCarousel() {
    const slides = [
        {
            id: 1,
            image: '/imagens/art1.jpg',
            overline: 'Arte Local',
            title: 'Feita aqui.',
            italicTitle: 'Para o mundo.',
            description: 'Valorizamos artistas independentes de Recife que transformam cultura, histórias e paisagens em obras únicas.',
            link: '/galeria',
            buttonText: 'Conheça nossos artistas'
        },
        {
            id: 2,
            image: '/imagens/art2.jpg',
            overline: 'Artistas Independentes',
            title: 'Narrativas que',
            italicTitle: 'nascem da nossa terra.',
            description: 'Conectamos você aos talentos locais que transformam o cotidiano, a cultura e a natureza em expressões autênticas.',
            link: '/artistas',
            buttonText: 'Descubra mais'
        },
        {
            id: 3,
            image: '/imagens/art3.jpg',
            overline: 'Curadoria Local',
            title: 'Arte que floresce',
            italicTitle: 'na liberdade de criar.',
            description: 'Apoiamos a arte independente e fortalecemos a cena criativa de Recife, promovendo diversidade, identidade e novas perspectivas.',
            link: '/galeria',
            buttonText: 'Conheça a galeria'
        }
    ];

    return (
        <Carousel fade interval={8000} indicators={false} className="home-carousel-premium">
            {slides.map((slide, index) => (
                <Carousel.Item key={slide.id}>
                    <div className="hero-split-premium">
                        <div className="hero-text-side-premium">
                            <span className="premium-overline">{slide.overline}</span>
                            <h1 className="premium-title">
                                {slide.title} 
                                <span className="premium-italic"> {slide.italicTitle}</span>
                            </h1>
                            <p className="premium-description">{slide.description}</p>
                            <Link to={slide.link} className="premium-btn">
                                {slide.buttonText} →
                            </Link>
                            <div className="premium-slide-counter">
                                0{index + 1} — 03
                            </div>
                        </div>
                        <div className="hero-image-side-premium">
                            <img src={process.env.PUBLIC_URL + slide.image} alt={slide.title} />
                        </div>
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default HomeCarousel;