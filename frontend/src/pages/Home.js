import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/home.css';

// Importação dos componentes organizados
import HomeCarousel from '../components/HomeCarousel';
import CategorySection from '../components/CategorySection';
import Destaques from '../components/Destaques';
import HomeBanner from '../components/HomeBanner'; 
import ArtistSection from '../components/ArtistSection'; 
import Artists from '../components/Artists';

function Home() {
    const [featured, setFeatured] = useState([]);
    const [paintings, setPaintings] = useState([]);
    const [sculptures, setSculptures] = useState([]);
    const [photography, setPhotography] = useState([]);
    const [artists, setArtists] = useState([]); // Novo estado para artistas
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
                    axios.get('http://127.0.0.1:8000/api/artists/') // Nova chamada da API
                ]);

                if (isMounted) {
                    setFeatured(featRes.data);
                    setPaintings(paintRes.data);
                    setSculptures(sculpRes.data);
                    setPhotography(photoRes.data);
                    setArtists(artistsRes.data); // Armazena os artistas
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
            {/* Banner Principal em Carrossel */}
            <HomeCarousel />

            {/* Navegação Rápida por Categorias */}
            <CategorySection />

            {/* Vitrine de Produtos (Destaques e Categorias) */}
            <main className="container pb-5">
                {loading ? (
                    <div className="text-center py-5">
                        <h5>Carregando curadoria...</h5>
                    </div>
                ) : (
                    <>
                        <Destaques produtos={featured} title="Destaques da Semana" link="/galeria" />
                        
                        <Destaques 
                            produtos={paintings} 
                            title="Pinturas" 
                            link="/galeria?categoria=Pintura" 
                        />
                        
                        <Destaques 
                            produtos={sculptures} 
                            title="Esculturas" 
                            link="/galeria?categoria=Escultura" 
                        />
                        
                        <Destaques 
                            produtos={photography} 
                            title="Fotografia" 
                            link="/galeria?categoria=Fotografia" 
                        />
                    </>
                )}
            </main>

            {/* Seção de Destaque Editorial */}
            <HomeBanner />
            
            {/* Seção de Artistas */}
            <Artists artists={artists} /> {/* Componente Artists integrado */}
            
            <ArtistSection />
        </div>
    );
}

export default Home;