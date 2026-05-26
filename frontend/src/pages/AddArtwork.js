import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../styles/addArtwork.css';

function AddArtwork() {
    const history = useHistory();
    
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [style, setStyle] = useState('');
    const [countInstock, setCountInstock] = useState(1);
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (!storedUser) {
            history.push('/login');
        } else {
            setUserInfo(JSON.parse(storedUser));
        }
    }, [history]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); 
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('brand', userInfo.name || userInfo.username);
        formData.append('category_name', category); 
        formData.append('description', `Gênero: ${style}. ${description}`);
        formData.append('countInstock', countInstock);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token || userInfo.access}` 
                }
            };

            await axios.post('http://127.0.0.1:8000/fibonacci/products/create/', formData, config);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Erro ao cadastrar:", error.response ? error.response.data : error.message);
            setLoading(false);
        }
    };

    const closeAndRedirect = () => {
        setShowSuccessModal(false);
        history.push('/galeria');
    };

    if (!userInfo) return null;

    return (
        <div className="add-artwork-page animate-fade-in">
            <div className="container">
                <div className="artwork-form-wrapper">
                    
                    <div className="artwork-form-header">
                        <h1>Publicar Obra</h1>
                        <p>Preencha os dados técnicos e artísticos da sua peça</p>
                    </div>

                    <form className="form-split-container" onSubmit={submitHandler}>
                        <div className="image-upload-side">
                            <label className="image-preview-box" htmlFor="image-upload">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <i className="fas fa-camera"></i>
                                        <p className="m-0 font-weight-bold">Carregar Imagem</p>
                                        <small>PNG, JPG ou WEBP</small>
                                    </div>
                                )}
                            </label>
                            <input id="image-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} required />
                        </div>

                        <div className="fields-side">
                            <div className="custom-form-group">
                                <label>Título da Obra *</label>
                                <input type="text" className="custom-form-input" placeholder="Ex: Crepúsculo" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>

                            <div className="row">
                                <div className="col-md-6 custom-form-group">
                                    <label>Categoria *</label>
                                    <select className="custom-form-input" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                        <option value="">Selecione...</option>
                                        <option value="pintura">Pintura</option>
                                        <option value="desenho">Desenho</option>
                                        <option value="fotografia">Fotografia</option>
                                        <option value="escultura">Escultura</option>
                                        <option value="gravura">Gravura</option>
                                        <option value="digital">Arte Digital</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>
                                <div className="col-md-6 custom-form-group">
                                    <label>Estilo / Gênero *</label>
                                    <select className="custom-form-input" value={style} onChange={(e) => setStyle(e.target.value)} required>
                                        <option value="">Selecione...</option>
                                        <option value="barroco">Barroco</option>
                                        <option value="romântico">Romântico</option>
                                        <option value="moderno">Moderno</option>
                                        <option value="contemporâneo">Contemporâneo</option>
                                        <option value="surrealismo">Surrealismo</option>
                                        <option value="abstrato">Abstrato</option>
                                        <option value="realismo">Realismo</option>
                                        <option value="impressionismo">Impressionismo</option>
                                        <option value="minimalismo">Minimalismo</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 custom-form-group">
                                    <label>Preço (R$) *</label>
                                    <input type="number" step="0.01" className="custom-form-input" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                </div>
                                <div className="col-md-6 custom-form-group">
                                    <label>Estoque</label>
                                    <input type="number" className="custom-form-input" value={countInstock} onChange={(e) => setCountInstock(e.target.value)} min="1" />
                                </div>
                            </div>

                            <div className="custom-form-group">
                                <label>Descrição</label>
                                <textarea className="custom-form-input" placeholder="História, dimensões ou materiais..." value={description} onChange={(e) => setDescription(e.target.value)} rows="3"></textarea>
                            </div>

                            <button type="submit" className="btn-submit-artwork" disabled={loading}>
                                {loading ? 'Enviando...' : 'Publicar na Galeria'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showSuccessModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content animate-pop-in">
                        <div className="modal-icon-success">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h2>Obra Publicada!</h2>
                        <p>Sua arte já está disponível para colecionadores na galeria Fibonacci.</p>
                        <button className="btn-modal-confirm" onClick={closeAndRedirect}>
                            Ir para Galeria
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddArtwork;
