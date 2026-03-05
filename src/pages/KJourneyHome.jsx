import React from 'react';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lock, Crown, CheckCircle2, Navigation, Compass, BookOpen, User, ExternalLink, AlertCircle } from 'lucide-react';

const KJ_GOLD = "#D4AF37";
const KJ_BEIGE = "#FDFCF8";

// Polar Subscription URL
const POLAR_SUBSCRIPTION_URL = "https://polar.sh/youngja/subscriptions/pro_tier";

const KJourneyHome = () => {
    const { user, isPremium, loginWithGoogle, logout, authError } = useAuth();

    return (
        <div className="kj-container">
            {/* Header */}
            <nav className="kj-nav">
                <h1 className="kj-logo">K-Journey</h1>
                <div className="kj-nav-actions">
                    {authError && <div className="kj-error-tooltip"><AlertCircle size={16} /> {authError}</div>}
                    {user ? (
                        <div className="kj-user-info">
                            <span className="kj-tier-badge">{isPremium ? 'PRO' : 'FREE'}</span>
                            <span className="kj-username">{user.displayName || user.email.split('@')[0]}</span>
                            <button onClick={logout} className="kj-auth-btn">Logout</button>
                        </div>
                    ) : (
                        <button onClick={loginWithGoogle} className="kj-auth-btn">Sign In</button>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="kj-hero">
                <div className="kj-hero-image">
                    <img src="/hero.png" alt="Gyeongbokgung Palace at Sunset" />
                    <div className="kj-hero-dark-overlay"></div>
                    <div className="kj-hero-overlay">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Experience the True Soul of Korea
                        </motion.h2>
                        <p className="kj-hero-subtitle">Premium curation for the modern traveler.</p>
                    </div>
                </div>
            </header>

            {/* Tiers / Features Section */}
            <section className="kj-section">
                <h3 className="kj-section-title">Discover Your Journey</h3>
                <div className="kj-guide-grid">
                    <Link to="/transport" className="kj-guide-card no-decor">
                        <Navigation size={24} color={KJ_GOLD} />
                        <span>Transport</span>
                        <small className="kj-free-label">Free</small>
                    </Link>
                    <Link to="/destinations" className="kj-guide-card no-decor">
                        <Compass size={24} color={KJ_GOLD} />
                        <span>Destinations</span>
                        <small className="kj-free-label">Free</small>
                    </Link>
                    <Link to="/culture" className="kj-guide-card no-decor kj-pro-card">
                        <BookOpen size={24} color={KJ_GOLD} />
                        <span>Culture Guide</span>
                        {!isPremium && <Lock size={14} className="kj-lock-icon" />}
                        <small className="kj-pro-label">Pro</small>
                    </Link>
                    <Link to="/itinerary" className="kj-guide-card no-decor kj-pro-card">
                        <User size={24} color={KJ_GOLD} />
                        <span>Itineraries</span>
                        {!isPremium && <Lock size={14} className="kj-lock-icon" />}
                        <small className="kj-pro-label">Pro</small>
                    </Link>
                    <Link to="/lessons" className="kj-guide-card no-decor kj-pro-card">
                        <BookOpen size={24} color={KJ_GOLD} />
                        <span>Lessons</span>
                        {!isPremium && <Lock size={14} className="kj-lock-icon" />}
                        <small className="kj-pro-label">Pro</small>
                    </Link>
                </div>
            </section>

            {/* Subscription Paywall */}
            <section className="kj-section kj-premium-section">
                {!isPremium ? (
                    <div className="kj-subscription-container">
                        <div className="kj-pricing-card">
                            <div className="kj-card-header">
                                <Crown size={32} color={KJ_GOLD} />
                                <h4>Become a Pro Traveler</h4>
                                <p className="kj-price-tag">$4.99 <span>/ month</span></p>
                            </div>
                            <ul className="kj-benefits-list">
                                <li><CheckCircle2 size={18} color={KJ_GOLD} /> Full Access to Culture Depth Guide</li>
                                <li><CheckCircle2 size={18} color={KJ_GOLD} /> Hidden Local Gems (No-Tourist zones)</li>
                                <li><CheckCircle2 size={18} color={KJ_GOLD} /> Personalized Trip Planning</li>
                                <li><CheckCircle2 size={18} color={KJ_GOLD} /> Audio Phrasebook & Pronunciation</li>
                            </ul>
                            <a href={POLAR_SUBSCRIPTION_URL} target="_blank" rel="noopener noreferrer" className="kj-polar-btn pro">
                                Switch to PRO <ExternalLink size={18} style={{ marginLeft: '8px' }} />
                            </a>
                            {!user && <p className="kj-auth-hint">Please sign in first to subscribe!</p>}
                        </div>
                    </div>
                ) : (
                    <div className="kj-premium-unlocked">
                        <div className="kj-badge"><Crown size={20} color={KJ_GOLD} /> K-Journey PRO Unlocked</div>
                        <div className="kj-culture-grid">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="kj-culture-card">
                                <h5>Deep Culture: The Art of Tea</h5>
                                <p>An exclusive look into traditional tea ceremonies in Insadong.</p>
                                <Link to="/culture" className="kj-read-more">Read More</Link>
                            </motion.div>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="kj-culture-card">
                                <h5>Pro Tip: Night Markets</h5>
                                <p>The best hidden carts in Gwangjang Market where locals eat.</p>
                                <Link to="/destinations" className="kj-read-more">View Map</Link>
                            </motion.div>
                        </div>
                    </div>
                )}
            </section>

            <style jsx>{`
        .no-decor { text-decoration: none; color: inherit; }
        .kj-container { background: ${KJ_BEIGE}; min-height: 100vh; font-family: 'Inter', sans-serif; color: #333; }
        .kj-nav { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 5%; background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid #f0f0f0; }
        .kj-logo { color: ${KJ_GOLD}; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; }
        .kj-nav-actions { display: flex; align-items: center; gap: 1rem; }
        .kj-error-tooltip { background: #fee2e2; color: #b91c1c; font-size: 0.75rem; padding: 0.4rem 0.8rem; border-radius: 8px; display: flex; align-items: center; gap: 0.4rem; border: 1px solid #fecaca; }
        .kj-user-info { display: flex; align-items: center; gap: 1rem; }
        .kj-tier-badge { background: #000; color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; }
        .kj-username { font-size: 0.9rem; font-weight: 600; }
        .kj-auth-btn { padding: 0.6rem 1.4rem; border-radius: 50px; border: none; background: #000; color: white; cursor: pointer; transition: 0.3s; font-size: 0.9rem; font-weight: 600; }
        .kj-auth-btn:hover { background: #333; transform: scale(1.02); }
        
        .kj-hero { width: 100%; height: 75vh; overflow: hidden; position: relative; }
        .kj-hero-image img { width: 100%; height: 100%; object-fit: cover; }
        .kj-hero-dark-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6)); z-index: 1; }
        .kj-hero-overlay { position: absolute; bottom: 15%; left: 8%; color: white; z-index: 2; }
        .kj-hero-overlay h2 { font-size: 3.5rem; margin: 0; font-weight: 800; line-height: 1.1; max-width: 600px; font-family: 'Noto Serif KR', serif; text-shadow: 0 4px 30px rgba(0,0,0,0.5); }
        .kj-hero-subtitle { font-size: 1.2rem; opacity: 1; margin-top: 1rem; font-weight: 400; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }

        .kj-section { padding: 4rem 8%; }
        .kj-section-title { font-size: 1.8rem; margin-bottom: 2.5rem; color: #1a1a1a; font-weight: 800; letter-spacing: -1px; }
        
        .kj-guide-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .kj-guide-card { position: relative; display: flex; flex-direction: column; align-items: center; padding: 2.5rem 1.5rem; background: white; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 1px solid transparent; }
        .kj-guide-card:hover { transform: translateY(-10px); border-color: ${KJ_GOLD}; box-shadow: 0 20px 40px rgba(212, 175, 55, 0.1); }
        .kj-guide-card span { margin-top: 1rem; font-size: 1rem; font-weight: 700; color: #1a1a1a; }
        .kj-free-label { background: #f0f0f0; padding: 0.1rem 0.5rem; border-radius: 4px; font-size: 0.65rem; color: #666; margin-top: 0.5rem; }
        .kj-pro-label { background: #fff4d1; padding: 0.1rem 0.5rem; border-radius: 4px; font-size: 0.65rem; color: ${KJ_GOLD}; font-weight: 700; margin-top: 0.5rem; }
        .kj-lock-icon { position: absolute; top: 1rem; right: 1rem; opacity: 0.4; }

        .kj-subscription-container { display: flex; justify-content: center; margin-top: 2rem; }
        .kj-pricing-card { background: white; border-radius: 32px; padding: 4rem; text-align: center; box-shadow: 0 30px 60px rgba(0,0,0,0.06); width: 100%; max-width: 550px; border: 2px solid ${KJ_BEIGE}; }
        .kj-card-header h4 { font-size: 2rem; font-weight: 800; margin: 1rem 0; color: #1a1a1a; }
        .kj-price-tag { font-size: 2.5rem; font-weight: 800; color: ${KJ_GOLD}; }
        .kj-price-tag span { font-size: 1rem; color: #999; font-weight: 400; }
        .kj-benefits-list { list-style: none; padding: 2rem 0; display: inline-block; text-align: left; }
        .kj-benefits-list li { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; color: #444; font-weight: 500; font-size: 1.05rem; }
        
        .kj-polar-btn.pro { background: #000; color: white; padding: 1.2rem; border-radius: 100px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 700; text-decoration: none; box-shadow: 0 10px 20px rgba(0,0,0,0.2); transition: 0.3s; }
        .kj-polar-btn.pro:hover { transform: scale(1.03); background: #222; }

        .kj-premium-unlocked { background: white; padding: 3rem; border-radius: 32px; border: 1px solid ${KJ_GOLD}; box-shadow: 0 20px 50px rgba(212, 175, 55, 0.08); }
        .kj-badge { display: inline-flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1.5rem; background: #fffdea; border-radius: 100px; color: ${KJ_GOLD}; font-size: 0.9rem; font-weight: 800; margin-bottom: 2rem; border: 1px solid #ffecad; }
        .kj-culture-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .kj-culture-card { padding: 2.5rem; background: ${KJ_BEIGE}; border-radius: 24px; border: 1px solid #f0f0f0; }
        .kj-culture-card h5 { font-size: 1.3rem; margin-bottom: 0.8rem; font-weight: 800; }
        .kj-read-more { margin-top: 1.5rem; background: none; border: none; font-weight: 700; color: ${KJ_GOLD}; cursor: pointer; border-bottom: 1.5px solid ${KJ_GOLD}; padding: 0; font-size: 0.9rem; text-decoration: none; display: inline-block; }

        @media (max-width: 900px) {
          .kj-guide-grid { grid-template-columns: 1fr 1fr; }
          .kj-culture-grid { grid-template-columns: 1fr; }
          .kj-hero-overlay h2 { font-size: 2.5rem; }
        }
      `}</style>
        </div>
    );
};

export default KJourneyHome;
