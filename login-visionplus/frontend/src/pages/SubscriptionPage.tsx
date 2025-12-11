import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import './SubscriptionPage.css';

const SubscriptionPage: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSelectPlan = (plan: string) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlan(null);
    };

    const handleConfirmPayment = async () => {
        if (!selectedPlan) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/subscriptions/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ planType: selectedPlan }),
            });

            if (response.ok) {
                alert('Subscription successful!');
                navigate('/inicio'); // Redirect to home
            } else {
                alert('Subscription failed. Please try again.');
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            alert('An error occurred.');
        } finally {
            handleCloseModal();
        }
    };

    return (
        <div className="subscription-page">
            <header className="subscription-header">
                <div className="brand-logo" onClick={() => navigate('/inicio')}>
                    VISIONPLUS
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="btn-back"
                >
                    Volver
                </button>
            </header>

            <div className="subscription-content">
                <h1 className="page-title">Elige tu plan</h1>
                <div className="plans-container">
                    {/* Basic Plan */}
                    <div className="plan-card">
                        <h2 className="plan-name">Básico</h2>
                        <p className="plan-price">$9.99<span className="plan-period">/mes</span></p>
                        <ul className="plan-features">
                            <li><span className="check-icon">✓</span> Calidad Buena (720p)</li>
                            <li><span className="check-icon">✓</span> Ver en 1 pantalla</li>
                            <li><span className="check-icon">✓</span> Sin anuncios</li>
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('BASIC')}
                            className="btn-select basic"
                        >
                            Seleccionar Básico
                        </button>
                    </div>

                    {/* Standard Plan */}
                    <div className="plan-card standard">
                        <h2 className="plan-name">Estándar</h2>
                        <p className="plan-price">$14.99<span className="plan-period">/mes</span></p>
                        <ul className="plan-features">
                            <li><span className="check-icon">✓</span> Calidad Muy Buena (1080p)</li>
                            <li><span className="check-icon">✓</span> Ver en 2 pantallas</li>
                            <li><span className="check-icon">✓</span> Descargas disponibles</li>
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('STANDARD')}
                            className="btn-select standard"
                        >
                            Seleccionar Estándar
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="plan-card premium">
                        <div className="popular-badge">MEJOR VALOR</div>
                        <h2 className="plan-name">Premium</h2>
                        <p className="plan-price">$19.99<span className="plan-period">/mes</span></p>
                        <ul className="plan-features">
                            <li><span className="check-icon">✓</span> Calidad Excepcional (4K+HDR)</li>
                            <li><span className="check-icon">✓</span> Ver en 4 pantallas</li>
                            <li><span className="check-icon">✓</span> Audio Espacial</li>
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('PREMIUM')}
                            className="btn-select premium"
                        >
                            Seleccionar Premium
                        </button>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmPayment}
                planType={selectedPlan || ''}
            />
        </div>
    );
};

export default SubscriptionPage;
