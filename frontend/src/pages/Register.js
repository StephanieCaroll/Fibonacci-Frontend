import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

function Register() {
    const routeLocation = useLocation();
    const query = new URLSearchParams(routeLocation.search);
    const redirect = query.get('redirect');
    const typeFromUrl = query.get('tipo');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [location, setLocation] = useState('');
    const [accountType, setAccountType] = useState(typeFromUrl === 'artist' ? 'artist' : 'customer');

    const [countries, setCountries] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState('');

    const getRedirectPath = (selectedType = accountType) => {
        if (redirect) return redirect;
        return selectedType === 'artist' ? '/perfil-artista' : '/minha-conta';
    };

    useEffect(() => {
        const images = [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000',
            'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=2000',
            'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2000'
        ];
        setBackgroundImage(images[Math.floor(Math.random() * images.length)]);

        axios.get('https://restcountries.com/v3.1/all?fields=name,translations')
            .then(res => {
                const list = res.data.map(c => c.translations.por.common).sort();
                setCountries(list);
            })
            .catch(() => setCountries(['Brasil', 'Portugal', 'Angola']));
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
                name,
                email,
                password,
                location
            });

            const userInfoWithProfile = {
                ...data,
                location: data.location || location,
                accountType
            };

            localStorage.setItem('userInfo', JSON.stringify(userInfoWithProfile));
            window.location.href = getRedirectPath(accountType);
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
                    <p className="auth-subtitle">Defina se sua conta será usada para comprar obras ou publicar sua produção artística.</p>

                    <div className="account-type-toggle" aria-label="Tipo de conta">
                        <button
                            type="button"
                            className={accountType === 'customer' ? 'active' : ''}
                            onClick={() => setAccountType('customer')}
                        >
                            Cliente
                        </button>
                        <button
                            type="button"
                            className={accountType === 'artist' ? 'active' : ''}
                            onClick={() => setAccountType('artist')}
                        >
                            Artista
                        </button>
                    </div>

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
                            {loading ? 'Processando...' : accountType === 'artist' ? 'Criar Conta de Artista' : 'Criar Conta de Cliente'}
                        </button>
                    </form>
                    <p className="auth-switch-text">
                        Já tem uma conta? <Link to={`/login?tipo=${accountType}${redirect ? `&redirect=${redirect}` : ''}`}>Entre aqui</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
