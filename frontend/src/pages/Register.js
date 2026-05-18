import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

function Register() {
    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [location, setLocation] = useState(''); 
    
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        // Lógica da imagem aleatória
        const images = [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000',
            'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=2000',
            'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2000'
        ];
        setBackgroundImage(images[Math.floor(Math.random() * images.length)]);

        // Busca países
        axios.get('https://restcountries.com/v3.1/all?fields=name,translations')
            .then(res => {
                const list = res.data.map(c => c.translations.por.common).sort();
                setCountries(list);
            })
            .catch(() => setCountries(["Brasil", "Portugal", "Angola"]));
    }, []);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        try {
           
            const { data } = await axios.post('http://127.0.0.1:8000/fibonacci/users/register/', {
                name, email, password, location
            });

            const userInfoWithLocation = {
                ...data,
                location: data.location || location 
            };

            localStorage.setItem('userInfo', JSON.stringify(userInfoWithLocation));
            
            window.location.href = '/perfil'; 
        } catch (err) {
            setError('Erro ao criar conta. Verifique se o e-mail já existe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-image-side" style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="auth-image-overlay"></div>
            </div>

            <div className="auth-form-side">
                <div className="auth-form-wrapper">
                    <h1 className="auth-title">Crie sua Conta</h1>
                    {error && <div className="error-alert-fibonacci">{error}</div>}

                    <form onSubmit={submitHandler}>
                        <div className="auth-form-group">
                            <label>Nome Completo</label>
                            <input type="text" className="auth-input" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="auth-form-group">
                            <label>E-mail</label>
                            <input type="email" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="auth-form-group">
                            <label>País / Localização</label>
                            <select 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)} 
                                required 
                                className="auth-select"
                            >
                                <option value="">Selecione seu país</option>
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="auth-row">
                            <div className="auth-form-group">
                                <label>Senha</label>
                                <input type="password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="auth-form-group">
                                <label>Confirmar</label>
                                <input type="password" className="auth-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                        </div>

                        <button type="submit" className="btn-auth-submit" disabled={loading}>
                            {loading ? 'Processando...' : 'Registrar'}
                        </button>
                    </form>
                    <p className="auth-switch-text">Já tem uma conta? <Link to="/login">Entre aqui</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;