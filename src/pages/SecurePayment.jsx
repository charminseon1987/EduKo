import React from 'react';
import './SecurePayment.css';

const SecurePayment = () => {
    return (
        <div className="page-container payment-page fade-in">
            <header className="payment-header">
                <button className="icon-btn back-btn">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="header-title">Secure Payment</h2>
            </header>

            <main className="page-content payment-content no-scrollbar">
                <section className="summary-section">
                    <h3 className="section-title">Plan Summary</h3>
                    <div className="summary-card">
                        <div className="summary-info">
                            <p className="summary-label">Advanced Course</p>
                            <h4 className="summary-title">AI Professional Certification</h4>
                            <p className="summary-subtitle">12 Months Premium Access</p>
                            <p className="summary-price">$199.00</p>
                        </div>
                        <div
                            className="summary-image"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCgo8AK38-u_ZD_e6SjGM1_HYZVd9ZcM1chMO7RYpHMRA-XATJW3FD6aYS51Pkkxv66dLCtNMuWQAo8uLIgBNwpCT--xDOp8LzlwH6ZSuoz90eEOo_iw9PAfdMlPMzCwKR7ACg0kczl7vD9uZFieqViyz6PXR1_D53NGeUhCrOUT3HUHquV2bnfIKC2CZ7FfmeeLi8aRqNHhlpamyFU5WIKMcMv8MMFmOWTz0kvSt9BcXLnjuwaX4X4iLvH3zf8IUA6_95spbyDT1A")' }}
                        ></div>
                    </div>
                </section>

                <section className="method-section">
                    <h3 className="section-title">Payment Method</h3>
                    <div className="method-tabs no-scrollbar">
                        <div className="method-tab active">
                            <span className="material-symbols-outlined">credit_card</span>
                            <p>Card</p>
                        </div>
                        <div className="method-tab">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                            <p>PayPal</p>
                        </div>
                        <div className="method-tab">
                            <span className="material-symbols-outlined">ios</span>
                            <p>Apple</p>
                        </div>
                        <div className="method-tab">
                            <span className="material-symbols-outlined">google</span>
                            <p>Google</p>
                        </div>
                    </div>
                </section>

                <form className="payment-form">
                    <div className="form-group">
                        <label>Cardholder Name</label>
                        <input type="text" placeholder="John Doe" className="form-input" />
                    </div>
                    <div className="form-group">
                        <label>Card Number</label>
                        <div className="input-with-icon">
                            <input type="text" placeholder="0000 0000 0000 0000" className="form-input" />
                            <span className="material-symbols-outlined input-icon">credit_card</span>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Expiry Date</label>
                            <input type="text" placeholder="MM/YY" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>CVV</label>
                            <input type="password" placeholder="***" className="form-input" />
                        </div>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="save-card" />
                        <label htmlFor="save-card">Save card for future purchases</label>
                    </div>
                </form>

                <div className="trust-badges">
                    <div className="badge-item">
                        <span className="material-symbols-outlined text-green">verified_user</span>
                        <span>SSL Secure</span>
                    </div>
                    <div className="badge-item">
                        <span className="material-symbols-outlined text-primary">security</span>
                        <span>PCI Compliant</span>
                    </div>
                    <div className="badge-item">
                        <span className="material-symbols-outlined text-blue">encrypted</span>
                        <span>Encrypted</span>
                    </div>
                </div>
            </main>

            <footer className="payment-footer">
                <div className="total-row">
                    <span className="total-label">Total Amount</span>
                    <span className="total-value">$199.00</span>
                </div>
                <button className="pay-btn">
                    <span>Complete Purchase</span>
                    <span className="material-symbols-outlined">lock</span>
                </button>
                <p className="toc-text">
                    By clicking 'Complete Purchase', you agree to EduKo's Terms of Service and Privacy Policy.
                </p>
            </footer>
        </div>
    );
};

export default SecurePayment;
