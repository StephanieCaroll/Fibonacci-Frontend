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

function App() {
  return (
    <Router>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/galeria" component={Galeria} />
          <Route path="/perfil" component={Profile} />
          <Route path="/artistas" component={Artistas} />
          <Route path="/cart" component={Cart} />
          <Route path="/adicionar-obra" component={AddArtwork} />
        </Switch>
      </main>
      <Footer />
    </Router>
  );
}

export default App;