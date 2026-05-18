import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    
    const history = useHistory();
    const location = useLocation();
    
    const redirect = location.search ? location.search.split('=')[1] : '/perfil';

    useEffect(() => {
      
        const images = [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000',
            'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=2000',
            'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2000'
        ];
        setBackgroundImage(images[Math.floor(Math.random() * images.length)]);

        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            history.push(redirect);
        }
    }, [history, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' }
            };
            
            const { data } = await axios.post('http://127.0.0.1:8000/fibonacci/users/login/', {
                username: email, 
                password: password
            }, config);

            localStorage.setItem('userInfo', JSON.stringify(data));
            
            window.location.href = redirect;

        } catch (error) {
            setError(error.response && error.response.data.detail
                ? error.response.data.detail
                : 'Credenciais inválidas. Tente novamente.');
        }
    };

    return (
        <div className="auth-page">
        
            <div className="auth-image-side" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="auth-image-overlay"></div>
            </div>
            
            <div className="auth-form-side">
               
                <div className="auth-form-wrapper">
                    <h1 className="auth-title">Acesse o seu Acervo</h1>
                    <p className="auth-subtitle">Entre com os seus dados para gerir as suas obras e favoritos.</p>

                    {error && <div className="error-alert-fibonacci">{error}</div>}

                    <form onSubmit={submitHandler}>
                        <div className="auth-form-group">
                            <label>E-mail ou Usuário</label>
                            <input 
                                type="text" 
                                className="auth-input" 
                                placeholder="exemplo@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label>Senha</label>
                            <input 
                                type="password" 
                                className="auth-input" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                            <Link to="/esqueci-a-senha" title="Esqueceu a senha?" style={{ color: '#5D4037', fontSize: '0.8rem', textDecoration: 'none' }}>
                                Esqueceu a senha?
                            </Link>
                        </div>

                        <button type="submit" className="btn-auth-submit">Entrar</button>
                    </form>

                    <p className="auth-switch-text">
                        Ainda não possui uma conta? <Link to={redirect ? `/cadastro?redirect=${redirect}` : '/cadastro'}>Criar Conta</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;