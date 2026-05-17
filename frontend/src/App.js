import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Galeria from './pages/Galeria';

// Componentes temporários para teste
const Home = () => <div className="container mt-5"><h1>Início</h1></div>;
const Perfil = () => <div className="container mt-5"><h1>Perfil</h1></div>;

function App() {
  return (
    <Router>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/galeria" component={Galeria} />
          <Route path="/perfil" component={Perfil} />
        </Switch>
      </main>
      <Footer />
    </Router>
  );
}

export default App; 