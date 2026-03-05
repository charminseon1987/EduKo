import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ArrowLeft, Lock, Calendar, Map, CheckCircle, Tag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ItineraryDetail = () => {
    const { isPremium } = useAuth();
    const navigate = useNavigate();

    if (!isPremium) {
        return (
            <div className="gate-container">
                <div className="gate-card">
                    <Lock size={48} color="#D4AF37" />
                    <h2>Personalized Itineraries</h2>
                    <p>Unlock our curated 3-day and 7-day Seoul routes designed by travel experts.</p>
                    <div className="itinerary-preview-img">
                        <img src="/luxury_korean_itinerary_webp_1772686407876.png" alt="Itinerary Preview" />
                    </div>
                    <button onClick={() => navigate('/')} className="upgrade-btn">Unlock with PRO</button>
                </div>
                <style jsx>{`
                .gate-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #FDFCF8; padding: 2rem; }
                .gate-card { background: white; padding: 3rem; border-radius: 32px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.05); max-width: 500px; border: 1px solid #ffecad; }
                .itinerary-preview-img { width: 100%; height: 200px; margin: 1.5rem 0; border-radius: 16px; overflow: hidden; opacity: 0.3; filter: blur(2px); }
                .itinerary-preview-img img { width: 100%; height: 100%; object-fit: cover; }
                .gate-card h2 { margin: 1rem 0; font-weight: 800; font-family: 'Noto Serif KR', serif; }
                .upgrade-btn { background: #000; color: white; padding: 1rem 3rem; border: none; border-radius: 50px; font-weight: 700; cursor: pointer; mt: 1rem; }
            `}</style>
            </div>
        );
    }

    return (
        <div className="detail-container">
            <nav className="detail-nav">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Home</Link>
                <span className="page-title">Digital Itineraries</span>
            </nav>

            <section className="detail-hero">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hero-img-container">
                    <img src="/luxury_korean_itinerary_webp_1772686407876.png" alt="Seoul Adventure" />
                    <div className="hero-badge">Curated for PRO</div>
                </motion.div>
                <h1>72 Hours in Seoul</h1>
                <p className="subtitle">The perfect balance of tradition and future.</p>
            </section>

            <section className="timeline-section">
                <div className="timeline">
                    {[
                        { day: "Day 01", title: "Old Souls & Artisans", activities: ["Gyeongbokgung Palace (Royal Guard)", "Insadong Antique Street", "Traditional Hanok Tea House"] },
                        { day: "Day 02", title: "Concrete Jungles", activities: ["Dongdaemun Design Plaza", "Seongsu-dong Cafe Hopping", "N Seoul Tower Sunset"] },
                        { day: "Day 03", title: "The Local Rhythm", activities: ["Mangwon Market Food Tour", "Han River Picnic", "Hongdae Nightlife"] }
                    ].map((d, i) => (
                        <motion.div
                            key={i}
                            className="day-item"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.2 }}
                        >
                            <div className="day-meta">
                                <span className="day-number">{d.day}</span>
                                <div className="day-line"></div>
                            </div>
                            <div className="day-content">
                                <h3>{d.title}</h3>
                                <div className="activity-list">
                                    {d.activities.map((act, idx) => (
                                        <div key={idx} className="activity">
                                            <Clock size={14} color="#D4AF37" />
                                            <span>{act}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pro-tip">
                                    <Tag size={14} />
                                    <strong>Local Tip:</strong> Wear comfortable sneakers. You will walk 15k+ steps today!
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <style jsx>{`
        .detail-container { background: #FDFCF8; min-height: 100vh; font-family: 'Inter', sans-serif; padding-bottom: 5rem; }
        .detail-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 8%; background: white; border-bottom: 1px solid #eee; }
        .back-link { text-decoration: none; color: #666; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; }
        .page-title { color: #D4AF37; font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; }
        
        .detail-hero { padding: 4rem 8% 2rem; text-align: center; }
        .hero-img-container { width: 100%; max-width: 800px; height: 350px; margin: 0 auto 2rem; border-radius: 40px; overflow: hidden; position: relative; box-shadow: 0 40px 80px rgba(0,0,0,0.1); }
        .hero-img-container img { width: 100%; height: 100%; object-fit: cover; }
        .hero-badge { position: absolute; top: 1.5rem; left: 1.5rem; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); color: white; padding: 0.5rem 1rem; border-radius: 100px; font-size: 0.75rem; font-weight: 700; border: 1px solid rgba(255,255,255,0.2); }
        
        .detail-hero h1 { font-size: 2.8rem; font-weight: 800; font-family: 'Noto Serif KR', serif; margin-bottom: 1rem; }
        .subtitle { color: #888; font-size: 1.1rem; }

        .timeline-section { padding: 4rem 8%; max-width: 900px; margin: 0 auto; }
        .day-item { display: flex; gap: 3rem; margin-bottom: 4rem; }
        .day-meta { display: flex; flex-direction: column; align-items: center; }
        .day-number { font-size: 0.9rem; font-weight: 900; color: #D4AF37; width: 60px; text-align: right; }
        .day-line { width: 2px; flex: 1; background: #eee; margin-top: 1rem; position: relative; }
        .day-line::after { content: ""; position: absolute; top: 0; left: -4px; width: 10px; height: 10px; background: #D4AF37; border-radius: 50%; }

        .day-content { flex: 1; }
        .day-content h3 { font-size: 1.6rem; font-weight: 800; margin-bottom: 1.5rem; }
        .activity-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        .activity { display: flex; align-items: center; gap: 0.8rem; color: #444; font-weight: 500; }
        
        .pro-tip { background: #fffbe6; padding: 1.2rem; border-radius: 20px; border: 1px solid #ffe58f; display: flex; gap: 0.8rem; align-items: flex-start; font-size: 0.9rem; line-height: 1.5; color: #856404; }
      `}</style>
        </div>
    );
};

export default ItineraryDetail;
