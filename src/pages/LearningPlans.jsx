import React from 'react';
import BottomNav from '../components/BottomNav';
import './LearningPlans.css';

const LearningPlans = () => {
    const plans = [
        {
            name: 'Basic',
            price: '$0',
            period: '/month',
            cta: 'Start for Free',
            features: [
                'Access to 5 intro AI courses',
                'Community forum access',
                'Public digital badges'
            ],
            highlighted: false
        },
        {
            name: 'Pro',
            price: '$19',
            period: '/month',
            cta: 'Select Pro Plan',
            features: [
                'Access to all 150+ AI courses',
                'Professional Certificates',
                'Weekly expert webinars',
                'Offline viewing mode'
            ],
            highlighted: true,
            badge: 'Best Value'
        },
        {
            name: 'Enterprise',
            price: '$99',
            period: '/month',
            cta: 'Contact Sales',
            features: [
                '1-on-1 Dedicated Mentoring',
                'Custom learning paths',
                'Team Analytics & Management',
                '24/7 Priority Support'
            ],
            highlighted: false
        }
    ];

    const faqs = [
        {
            q: "What's included in Certificates?",
            a: "Our certificates are industry-recognized and can be shared on LinkedIn or your professional portfolio. Each one validates your mastery of specific AI concepts."
        },
        {
            q: "Can I cancel anytime?",
            a: "Yes, your subscription is flexible. You can cancel through your account settings at any point. You'll keep access until the end of your current billing cycle.",
            open: true
        },
        {
            q: "Do you offer student discounts?",
            a: "Absolutely! Validated students from accredited institutions are eligible for a 50% discount on the Pro monthly plan."
        }
    ];

    return (
        <div className="page-container plan-page fade-in">
            <header className="plan-header">
                <button className="icon-btn">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="header-title">EduKo Plans</h2>
            </header>

            <main className="page-content plan-content no-scrollbar">
                <div className="hero-section">
                    <h1 className="hero-title">
                        Choose your <span className="highlight">learning journey</span>
                    </h1>
                    <p className="hero-subtitle">Unlock the full potential of AI with curated paths and expert mentoring.</p>
                </div>

                <div className="plans-grid">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`plan-card ${plan.highlighted ? 'featured' : ''}`}>
                            {plan.badge && <div className="plan-badge">{plan.badge}</div>}
                            <div className="plan-info">
                                <h3 className="plan-name">{plan.name}</h3>
                                <div className="plan-price-wrap">
                                    <span className="price-value">{plan.price}</span>
                                    <span className="price-period">{plan.period}</span>
                                </div>
                            </div>
                            <button className={`plan-cta ${plan.highlighted ? 'primary' : 'secondary'}`}>
                                {plan.cta}
                            </button>
                            <div className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="feature-item">
                                        <span className={`material-symbols-outlined check ${plan.highlighted ? 'fill-1' : ''}`}>
                                            check_circle
                                        </span>
                                        <span className="feature-text">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="faq-section">
                    <h4 className="faq-title">Frequently Asked Questions</h4>
                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <details key={i} className="faq-item" open={faq.open}>
                                <summary className="faq-summary">
                                    <p className="faq-question">{faq.q}</p>
                                    <span className="material-symbols-outlined expand-icon">expand_more</span>
                                </summary>
                                <p className="faq-answer">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default LearningPlans;
