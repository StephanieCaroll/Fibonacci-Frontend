import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
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

        if (password !== confirmPassword) {
            setMessage('As senhas não coincidem.');
            return;
        }

        try {
            const config = {
                headers: { 'Content-Type': 'application/json' }
            };
            const { data } = await axios.post('http://127.0.0.1:8000/fibonacci/users/register/', {
                name: name,
                email: email,
                password: password
            }, config);

            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.href = redirect;

        } catch (error) {
            setError(error.response && error.response.data.detail
                ? error.response.data.detail
                : 'Erro ao criar conta. Verifique os dados.');
        }
    };

    return (
        <div className="auth-page animate-fade-in">
            <div className="auth-form-side">
                <h1 className="auth-title">Junte-se a Nós</h1>
                <p className="auth-subtitle">Crie a sua conta para adquirir e expor obras originais.</p>

                {message && <div className="error-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={submitHandler}>
                    <div className="auth-form-group">
                        <label>Nome Completo</label>
                        <input 
                            type="text" 
                            className="auth-input" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-form-group">
                        <label>E-mail</label>
                        <input 
                            type="email" 
                            className="auth-input" 
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-form-group">
                        <label>Confirmar Senha</label>
                        <input 
                            type="password" 
                            className="auth-input" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth-submit">Criar Conta</button>
                </form>

                <p className="auth-switch-text">
                    Já tem uma conta? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Fazer Login</Link>
                </p>
            </div>
            
            <div className="auth-image-side" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2000')" }}>
                <div className="auth-image-overlay"></div>
            </div>
        </div>
    );
}

export default Register;