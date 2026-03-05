import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ArrowLeft, MapPin, Star, Navigation, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const DestinationsDetail = () => {
    const { isPremium } = useAuth();
    const navigate = useNavigate();

    const spots = [
        { title: "Gyeongbokgung Palace", desc: "The main royal palace of the Joseon dynasty.", rating: 4.8, type: "Free" },
        { title: "Bukchon Hanok Village", desc: "Traditional Korean village with a 600-year history.", rating: 4.7, type: "Free" },
        { title: "Seongsu-dong Backstreets", desc: "The 'Brooklyn of Seoul'. Hidden local workshops.", rating: 4.9, type: "PRO", secret: true },
        { title: "Euljiro Underground Bar", desc: "No sign outside, only for those who know the code.", rating: 5.0, type: "PRO", secret: true }
    ];

    return (
        <div className="dest-container">
            <nav className="dest-nav">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Home</Link>
                <span className="page-title">Top Destinations</span>
            </nav>

            <section className="dest-hero">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="map-mockup">
                    <div className="map-overlay">
                        <div className="pulse-pin" style={{ top: '40%', left: '30%' }}><MapPin size={16} color="white" /></div>
                        <div className="pulse-pin delay" style={{ top: '60%', left: '70%' }}><MapPin size={16} color="white" /></div>
                    </div>
                    <img src="https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=1000" alt="Seoul Map View" />
                </motion.div>
                <h1>Discover Hidden Seoul</h1>
                <p>From royal palaces to secretive underground joints.</p>
            </section>

            <div className="spots-grid">
                {spots.map((spot, idx) => (
                    <motion.div
                        key={idx}
                        className={`spot-card ${spot.secret ? 'premium-spot' : ''}`}
                        whileHover={{ y: -5 }}
                    >
                        <div className="spot-header">
                            {spot.secret && <Crown size={14} color="#D4AF37" />}
                            <span className="spot-type">{spot.type}</span>
                        </div>
                        <h3>{spot.title}</h3>
                        <p>{spot.desc}</p>
                        <div className="spot-footer">
                            <span className="rating"><Star size={14} fill="#D4AF37" color="#D4AF37" /> {spot.rating}</span>
                            {spot.secret && !isPremium ? (
                                <button onClick={() => navigate('/')} className="lock-btn">Unlock</button>
                            ) : (
                                <button className="view-btn">View Map</button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <style jsx>{`
        .dest-container { background: #FDFCF8; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .dest-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 8%; background: white; border-bottom: 1px solid #eee; }
        .back-link { text-decoration: none; color: #666; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; }
        .page-title { color: #D4AF37; font-weight: 800; font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase; }
        
        .dest-hero { padding: 4rem 8%; text-align: center; }
        .map-mockup { width: 100%; max-width: 900px; height: 300px; margin: 0 auto 3rem; border-radius: 32px; overflow: hidden; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.1); }
        .map-mockup img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.5) brightness(0.8); }
        .map-overlay { position: absolute; inset: 0; z-index: 2; background: rgba(212, 175, 55, 0.1); }
        
        .pulse-pin { position: absolute; background: #D4AF37; padding: 10px; border-radius: 50%; box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); animation: pulse 2s infinite; }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7); }
            70% { box-shadow: 0 0 0 20px rgba(212, 175, 55, 0); }
            100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }
        .delay { animation-delay: 1s; }

        .spots-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; padding: 0 8% 4rem; }
        .spot-card { background: white; padding: 2rem; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.02); border: 1px solid #eee; }
        .premium-spot { border-color: #ffecad; background: #fffdf5; }
        .spot-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
        .spot-type { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #999; }
        .spot-card h3 { font-size: 1.2rem; margin-bottom: 0.5rem; }
        .spot-card p { font-size: 0.9rem; color: #666; line-height: 1.6; margin-bottom: 1.5rem; }
        
        .spot-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f5f5f5; pt: 1rem; }
        .rating { display: flex; align-items: center; gap: 0.3rem; font-weight: 700; font-size: 0.9rem; }
        .view-btn, .lock-btn { padding: 0.5rem 1.2rem; border-radius: 50px; border: none; font-size: 0.8rem; font-weight: 700; cursor: pointer; }
        .view-btn { background: #000; color: white; }
        .lock-btn { background: #D4AF37; color: white; }
      `}</style>
        </div>
    );
};

export default DestinationsDetail;
