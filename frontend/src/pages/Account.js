import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../styles/Account.css';
import AddressCard from '../components/AddressCard';

const API_BASE = 'http://127.0.0.1:8000/fibonacci';

const Account = () => {
    const history = useHistory();
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);

    const [formData, setFormData] = useState({
        address: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        postalCode: '',
        complement: ''
    });
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        location: '',
        bio: ''
    });

    const hydrateProfileForm = (data) => {
        setProfileForm({
            name: data.name || data.username || '',
            email: data.email || '',
            location: data.location || '',
            bio: data.bio || ''
        });
    };

    useEffect(() => {
        const fetchAccountData = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));

            if (!userInfo) {
                history.push('/login?redirect=/minha-conta');
                return;
            }

            const token = userInfo.token || userInfo.access;
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            setUserData(userInfo);
            hydrateProfileForm(userInfo);

            try {
                const { data: profileData } = await axios.get(`${API_BASE}/users/profile/`, config);
                const mergedProfile = { ...userInfo, ...profileData, token };
                setUserData(mergedProfile);
                hydrateProfileForm(mergedProfile);

                try {
                    const { data: addressData } = await axios.get(`${API_BASE}/users/profile/addresses/`, config);
                    setAddresses(Array.isArray(addressData) ? addressData : []);
                } catch (addressError) {
                    console.warn('Enderecos nao disponiveis:', addressError);
                    setAddresses([]);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
    }, [history]);

    const deleteAddress = async (id) => {
        if (!id) return;

        if (window.confirm('Tem certeza que deseja excluir este endereco?')) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = userInfo.token || userInfo.access;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                await axios.delete(`${API_BASE}/users/profile/addresses/delete/${id}/`, config);
                setAddresses(addresses.filter(addr => addr._id !== id && addr.id !== id));
            } catch (error) {
                console.error('Erro ao excluir:', error);
                alert('Erro ao excluir endereco.');
            }
        }
    };

    const fetchAddressByCEP = async (cep) => {
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length === 8) {
            try {
                const { data } = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        address: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf
                    }));
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo.token || userInfo.access;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.post(`${API_BASE}/users/profile/addresses/add/`, formData, config);

            setAddresses([...addresses, data || formData]);
            alert('Endereco salvo com sucesso!');
            setShowModal(false);
            setFormData({ address: '', number: '', neighborhood: '', city: '', state: '', postalCode: '', complement: '' });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar endereco.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'postalCode') {
            fetchAddressByCEP(value);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm({ ...profileForm, [name]: value });
    };

    const saveProfileData = async () => {
        setSavingProfile(true);

        try {
            const storedUser = JSON.parse(localStorage.getItem('userInfo'));
            const token = storedUser.token || storedUser.access;
            const form = new FormData();

            form.append('name', profileForm.name);
            form.append('email', profileForm.email);
            form.append('location', profileForm.location);
            form.append('bio', profileForm.bio);

            const { data } = await axios.put(`${API_BASE}/users/profile/update/`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedUser = {
                ...storedUser,
                ...userData,
                ...data,
                ...profileForm,
                token,
                accountType: storedUser.accountType || userData.accountType
            };

            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUserData(updatedUser);
            hydrateProfileForm(updatedUser);
            setIsEditingProfile(false);
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil.');
        } finally {
            setSavingProfile(false);
        }
    };

    if (loading) return <div className="container mt-5">Carregando...</div>;

    return (
        <div className="container account-container">
            <h1 className="account-title">Minha Conta</h1>
            {userData && (
                <div className="row">
                    <div className="col-md-6">
                        <div className="account-card">
                            <div className="account-card-heading">
                                <h4>Dados pessoais</h4>
                                <button
                                    type="button"
                                    className="account-edit-btn"
                                    onClick={() => {
                                        hydrateProfileForm(userData);
                                        setIsEditingProfile(!isEditingProfile);
                                    }}
                                >
                                    {isEditingProfile ? 'Cancelar' : 'Editar perfil'}
                                </button>
                            </div>

                            {isEditingProfile ? (
                                <div className="account-profile-form">
                                    <label>
                                        Nome
                                        <input name="name" value={profileForm.name} onChange={handleProfileChange} />
                                    </label>
                                    <label>
                                        E-mail
                                        <input name="email" type="email" value={profileForm.email} onChange={handleProfileChange} />
                                    </label>
                                    <label>
                                        Localizacao
                                        <input name="location" value={profileForm.location} onChange={handleProfileChange} />
                                    </label>
                                    <label>
                                        Bio
                                        <textarea name="bio" value={profileForm.bio} onChange={handleProfileChange} rows="4" />
                                    </label>
                                    <button className="account-save-btn" onClick={saveProfileData} disabled={savingProfile}>
                                        {savingProfile ? 'Salvando...' : 'Salvar alteracoes'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p><strong>Nome:</strong> {userData.name || userData.username || 'Nao informado'}</p>
                                    <p><strong>Email:</strong> {userData.email || 'Nao informado'}</p>
                                    <p><strong>Localizacao:</strong> {userData.location || 'Nao informado'}</p>
                                    <p><strong>Tipo de conta:</strong> {userData.accountType === 'artist' ? 'Artista' : 'Cliente'}</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="account-card">
                            <h4>Meus enderecos</h4>
                            {addresses.length > 0 ? (
                                addresses.map((addr, index) => (
                                    <AddressCard
                                        key={addr._id || addr.id || index}
                                        address={addr}
                                        onDelete={() => deleteAddress(addr._id || addr.id)}
                                    />
                                ))
                            ) : (
                                <p>Voce ainda nao tem enderecos cadastrados.</p>
                            )}
                            <button className="add-address-btn" onClick={() => setShowModal(true)}>
                                + Adicionar endereco
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content-boobam">
                        <div className="modal-header">
                            <h3>Novo endereco</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>

                        <form onSubmit={handleSaveAddress} className="address-form">
                            <div className="form-group">
                                <label>CEP</label>
                                <input type="text" name="postalCode" value={formData.postalCode} placeholder="00000-000" onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label>Endereco</label>
                                <input type="text" name="address" value={formData.address} placeholder="Rua..." onChange={handleChange} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>Numero</label>
                                    <input type="text" name="number" value={formData.number} placeholder="123" onChange={handleChange} required />
                                </div>
                                <div className="form-group col-6">
                                    <label>Complemento</label>
                                    <input type="text" name="complement" value={formData.complement} placeholder="Apto, bloco..." onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Bairro</label>
                                <input type="text" name="neighborhood" value={formData.neighborhood} placeholder="Bairro" onChange={handleChange} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group col-8">
                                    <label>Cidade</label>
                                    <input type="text" name="city" value={formData.city} placeholder="Cidade" onChange={handleChange} required />
                                </div>
                                <div className="form-group col-4">
                                    <label>Estado</label>
                                    <input type="text" name="state" value={formData.state} placeholder="PE" onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-footer">
                                <button type="submit" className="btn-save-boobam">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;
