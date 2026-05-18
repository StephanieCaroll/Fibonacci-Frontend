import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const history = useHistory();
    const location = useLocation();
    
    const redirect = location.search ? location.search.split('=')[1] : '/perfil';

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            history.push(redirect);
        }
    }, [history, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
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
        <div className="auth-page animate-fade-in">
            <div className="auth-image-side">
                <div className="auth-image-overlay"></div>
            </div>
            
            <div className="auth-form-side">
                <h1 className="auth-title">Acesse o seu Acervo</h1>
                <p className="auth-subtitle">Entre com os seus dados para gerir as suas obras e favoritos.</p>

                {error && <div className="error-message">{error}</div>}

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

                    <Link to="/esqueci-a-senha" className="auth-forgot-link">Esqueceu a senha?</Link>

                    <button type="submit" className="btn-auth-submit">Entrar</button>
                </form>

                <p className="auth-switch-text">
                    Ainda não possui uma conta? <Link to={redirect ? `/cadastro?redirect=${redirect}` : '/cadastro'}>Criar Conta</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;