import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Account.css'; 
import AddressCard from '../components/AddressCard';

const Account = () => {
    const [userData, setUserData] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        address: '', number: '', neighborhood: '', city: '', state: '', postalCode: '', complement: ''
    });

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) throw new Error("Usuário não autenticado");
                const config = { headers: { 'Authorization': `Bearer ${userInfo.token}` } };

                const { data: profileData } = await axios.get('/api/users/profile/', config);
                setUserData(profileData);
                const { data: addressData } = await axios.get('/api/users/profile/addresses/', config);
                
                // Dados recebidos do servidor
                console.log("DADOS RECEBIDOS DO SERVIDOR:", addressData);
                setAddresses(addressData);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAccountData();
    }, []);

    const deleteAddress = async (id) => {
        // Log para ver o ID sendo enviado para exclusão
        console.log("ID do endereço sendo enviado para exclusão:", id);

        if (window.confirm("Tem certeza que deseja excluir este endereço?")) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = { headers: { 'Authorization': `Bearer ${userInfo.token}` } };
                
                // Requisição corrigida usando o id capturado (que agora é o _id)
                await axios.delete(`/api/users/profile/addresses/delete/${id}/`, config);
                
                // Filtra pelo _id
                setAddresses(addresses.filter(addr => addr._id !== id));
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert("Erro ao excluir endereço.");
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
                console.error("Erro ao buscar CEP:", error);
            }
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { 'Authorization': `Bearer ${userInfo.token}` } };
            
            await axios.post('/api/users/profile/addresses/add/', formData, config);
            
            setAddresses([...addresses, formData]); 
            alert("Endereço salvo com sucesso!");
            setShowModal(false);
            setFormData({ address: '', number: '', neighborhood: '', city: '', state: '', postalCode: '', complement: '' });
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar endereço.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'postalCode') {
            fetchAddressByCEP(value);
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
                            <h4>Dados pessoais</h4>
                            <p><strong>Nome:</strong> {userData.name}</p>
                            <p><strong>Email:</strong> {userData.email}</p>
                        </div>
                    </div>
                    
                    <div className="col-md-6">
                        <div className="account-card">
                            <h4>Meus endereços</h4>
                            {addresses.length > 0 ? (
                                addresses.map((addr, index) => (
                                    <AddressCard 
                                        key={addr._id || index} 
                                        address={addr} 
                                        onDelete={() => deleteAddress(addr._id)} 
                                    />
                                ))
                            ) : (
                                <p>Você ainda não tem endereços cadastrados.</p>
                            )}
                            <button className="add-address-btn" onClick={() => setShowModal(true)}>
                                + Adicionar endereço
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content-boobam">
                        <div className="modal-header">
                            <h3>Novo endereço</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        
                        <form onSubmit={handleSaveAddress} className="address-form">
                            <div className="form-group">
                                <label>CEP</label>
                                <input type="text" name="postalCode" value={formData.postalCode} placeholder="00000-000" onChange={handleChange} required />
                            </div>
                            
                            <div className="form-group">
                                <label>Endereço</label>
                                <input type="text" name="address" value={formData.address} placeholder="Rua..." onChange={handleChange} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>Número</label>
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