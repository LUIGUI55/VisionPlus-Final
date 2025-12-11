import React, { useState } from 'react';
import './PaymentModal.css';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    planType: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm, planType }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            setLoading(false);
            onConfirm();
        }, 1500);
    };

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal">
                <h2 className="modal-title">Confirmar Suscripción</h2>
                <p className="modal-description">
                    Te estás suscribiendo al plan <span className="highlight-plan">
                        {planType === 'BASIC' ? 'Básico' : planType === 'STANDARD' ? 'Estándar' : 'Premium'}
                    </span>.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Número de Tarjeta (Simulado)</label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="0000 0000 0000 0000"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-col">
                            <label className="form-label">Expiración</label>
                            <input
                                type="text"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                placeholder="MM/YY"
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-col">
                            <label className="form-label">CVC</label>
                            <input
                                type="text"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                placeholder="123"
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-confirm"
                        >
                            {loading ? 'Procesando...' : 'Pagar y Suscribirse'}
                        </button>
                    </div>
                </form>
                <p className="mock-notice">
                    Este es un formulario de pago simulado. No se realizará ningún cargo real.
                </p>
            </div>
        </div>
    );
};

export default PaymentModal;
