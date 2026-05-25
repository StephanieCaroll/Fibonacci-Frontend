// Componentes de rotas da nossa aplicação: Fibonacci

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Galeria from './pages/Galeria';
import Profile from './pages/Profile';
import Artistas from './pages/Artistas';
import Cart from './pages/Cart';
import AddArtwork from './pages/AddArtwork';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import ArtistProfile from './pages/ArtistProfile';
import { CartProvider } from './context/CartContext'; 
import Account from './pages/Account'; 

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main style={{ minHeight: '80vh' }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/galeria" component={Galeria} />
            <Route path="/perfil" component={Profile} />
            <Route path="/minha-conta" component={Account} />
            <Route path="/artistas" component={Artistas} />
            <Route path="/cart" component={Cart} />
            <Route path="/adicionar-obra" component={AddArtwork} />
            <Route path="/login" component={Login} />
            <Route path="/cadastro" component={Register} />
            <Route path="/product/:id" component={ProductDetail} />
            <Route path="/artista/:id" component={ArtistProfile} />
          </Switch>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;