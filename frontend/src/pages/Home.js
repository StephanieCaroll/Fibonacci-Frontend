import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/home.css';

import HomeCarousel from '../components/HomeCarousel';
import CategorySection from '../components/CategorySection';
import Destaques from '../components/Destaques';
import Artists from '../components/Artists';

function Home() {
    const [featured, setFeatured] = useState([]);
    const [paintings, setPaintings] = useState([]);
    const [sculptures, setSculptures] = useState([]);
    const [photography, setPhotography] = useState([]);
    const [artists, setArtists] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; 
        async function fetchProducts() {
            setLoading(true);
            try {
                const [featRes, paintRes, sculpRes, photoRes, artistsRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/products/featured/'),
                    axios.get('http://127.0.0.1:8000/api/products/category/Pintura/'),
                    axios.get('http://127.0.0.1:8000/api/products/category/Escultura/'),
                    axios.get('http://127.0.0.1:8000/api/products/category/Fotografia/'),
                    axios.get('http://127.0.0.1:8000/api/artists/') 
                ]);

                if (isMounted) {
                    setFeatured(featRes.data);
                    setPaintings(paintRes.data);
                    setSculptures(sculpRes.data);
                    setPhotography(photoRes.data);
                    setArtists(artistsRes.data); 
                    setLoading(false);
                }
            } catch (error) {
                console.error("Erro ao carregar:", error);
                if (isMounted) setLoading(false);
            }
        }
        fetchProducts();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="home-page animate-fade-in">
            <HomeCarousel />
            <CategorySection />

            <main className="container pb-5 mt-4">
                {loading ? (
                    <div className="text-center py-5"><h5>A carregar curadoria...</h5></div>
                ) : (
                    <>
                        <div className="section-spacing"><Destaques produtos={featured} title="Destaques da Semana" link="/galeria" /></div>
                        <div className="section-spacing"><Destaques produtos={paintings} title="Pinturas" link="/galeria?categoria=Pintura" /></div>
                        <div className="section-spacing"><Destaques produtos={sculptures} title="Esculturas" link="/galeria?categoria=Escultura" /></div>
                        <div className="section-spacing"><Destaques produtos={photography} title="Fotografia" link="/galeria?categoria=Fotografia" /></div>
                    </>
                )}
            </main>

            {/* Nova classe de controle para evitar o espaçamento gigante */}
            <div className="artists-section-wrapper">
                <Artists artists={artists} /> 
            </div>
            
            <div className="editorial-banner-wrapper container mt-5 mb-5">
                <div className="editorial-banner-custom">
                    <div className="editorial-content-custom">
                        <span className="editorial-label-custom">EDITORIAL</span>
                        <h2 className="editorial-title-custom">A arte transforma<br/>espaços. E pessoas.</h2>
                        <p className="editorial-desc-custom">Leia o nosso editorial sobre arte,<br/>curadoria e criação local.</p>
                        <Link to="/" className="editorial-link-custom">LER EDITORIAL <span className="arrow">→</span></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;