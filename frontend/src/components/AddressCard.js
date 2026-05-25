import React from 'react';

const AddressCard = ({ address, onDelete }) => {
    return (
        <div className="address-card-item">
            <div className="address-info">
                {/* Exibindo os dados do endereço com segurança */}
                <strong>{address.address}, {address.number}</strong>
                {address.complement && <span> - {address.complement}</span>}
                <br />
                <small>
                    {address.neighborhood} - {address.city}/{address.state} | CEP: {address.postalCode}
                </small>
            </div>
            
            {/* O botão aciona a função onDelete recebida via props do componente Account */}
            <button 
                type="button" 
                className="delete-btn" 
                onClick={onDelete}
            >
                Excluir
            </button>
        </div>
    );
};

export default AddressCard;