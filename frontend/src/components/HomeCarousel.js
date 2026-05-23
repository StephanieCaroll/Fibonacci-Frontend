import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/homeCarousel.css';

function HomeCarousel() {
    const slides = [
        {
            id: 1,
            image: '/imagens/art1.jpg', // Certifique-se de que o arquivo se chama exatamente art1.jpg
            title: 'Arte Local, Alma Única.',
            subtitle: 'Explore uma curadoria exclusiva de obras originais.',
            link: '/galeria',
            buttonText: 'EXPLORAR ACERVO'
        },
        {
            id: 2,
            image: '/imagens/art2.jpg', // Certifique-se de que o arquivo se chama exatamente art2.jpg
            title: 'Sua Próxima Obra Prima.',
            subtitle: 'Descubra talentos locais que definem o futuro.',
            link: '/artistas',
            buttonText: 'CONHECER ARTISTAS'
        }
    ];

    return (
        <Carousel fade interval={6000} className="home-carousel">
            {slides.map(slide => (
                <Carousel.Item key={slide.id}>
                    <div className="carousel-item-inner">
                        <img 
                            className="d-block w-100" 
                            src={process.env.PUBLIC_URL + slide.image} 
                            alt={slide.title} 
                        />
                        <div className="carousel-overlay"></div>
                        <Carousel.Caption>
                            <h1 className="display-3 fw-bold">{slide.title}</h1>
                            <p className="lead">{slide.subtitle}</p>
                            <Link to={slide.link} className="btn btn-outline-light btn-lg mt-3">
                                {slide.buttonText}
                            </Link>
                        </Carousel.Caption>
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default HomeCarousel;