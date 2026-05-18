import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../styles/addArtwork.css';

function AddArtwork() {
    const history = useHistory();
    
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [countInstock, setCountInstock] = useState(1);
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); 
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('brand', brand);
        formData.append('description', description);
        formData.append('countInstock', countInstock);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            await axios.post('http://127.0.0.1:8000/fibonacci/products/create/', formData, config);
            
            alert('Obra cadastrada com sucesso na Galeria!');
            history.push('/galeria'); 

        } catch (error) {
            console.error("Erro ao cadastrar obra:", error.response ? error.response.data : error.message);
            alert("Erro ao cadastrar. Certifique-se de estar logado como artista.");
        }
    };

    return (
        <div className="add-artwork-page animate-fade-in">
            <div className="container">
                <div className="artwork-form-wrapper">
                    
                    <div className="artwork-form-header">
                        <h1>Cadastrar Nova Obra</h1>
                        <p>Adicione a sua arte ao nosso catálogo</p>
                    </div>

                    <form className="form-split-container" onSubmit={submitHandler}>
                        
                        <div className="image-upload-side">
                            <label className="image-preview-box" htmlFor="image-upload">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview da Obra" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <i className="fas fa-camera"></i>
                                        <p className="m-0 font-weight-bold">Clique para adicionar foto</p>
                                        <small>Formatos aceites: JPG, PNG, WEBP</small>
                                    </div>
                                )}
                            </label>
                            <input 
                                id="image-upload" 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={handleImageChange}
                                required
                            />
                        </div>

                        <div className="fields-side">
                            <div className="custom-form-group">
                                <label>Título da Obra *</label>
                                <input 
                                    type="text" 
                                    className="custom-form-input" 
                                    placeholder="Ex: Noite Estrelada no Sertão"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 custom-form-group">
                                    <label>Preço (R$) *</label>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        className="custom-form-input" 
                                        placeholder="Ex: 1500.00"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 custom-form-group">
                                    <label>O Seu Nome / Marca *</label>
                                    <input 
                                        type="text" 
                                        className="custom-form-input" 
                                        placeholder="O seu nome artístico"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="custom-form-group">
                                <label>Descrição e Detalhes da Obra</label>
                                <textarea 
                                    className="custom-form-input" 
                                    placeholder="Conte a história por trás desta peça, técnicas utilizadas, dimensões..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="custom-form-group">
                                <label>Quantidade Disponível (Stock)</label>
                                <input 
                                    type="number" 
                                    className="custom-form-input" 
                                    value={countInstock}
                                    onChange={(e) => setCountInstock(e.target.value)}
                                    min="1"
                                />
                            </div>

                            <button type="submit" className="btn-submit-artwork">
                                Publicar Obra na Galeria
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default AddArtwork;