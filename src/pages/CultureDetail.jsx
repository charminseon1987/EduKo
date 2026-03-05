import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ArrowLeft, Lock, Crown, Play, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const CultureDetail = () => {
    const { isPremium } = useAuth();
    const navigate = useNavigate();

    if (!isPremium) {
        return (
            <div className="gate-container">
                <div className="gate-card">
                    <Lock size={48} color="#D4AF37" />
                    <h2>Deep Culture Guide</h2>
                    <p>Unlock the secrets of Korean etiquette, history, and social nuances.</p>
                    <button onClick={() => navigate('/')} className="upgrade-btn">Unlock with PRO</button>
                </div>
                <style jsx>{`
                    .gate-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #FDFCF8; padding: 2rem; }
                    .gate-card { background: white; padding: 4rem 2rem; border-radius: 32px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.05); max-width: 450px; border: 1px solid #ffecad; }
                    .gate-card h2 { margin: 1.5rem 0 1rem; font-weight: 800; font-family: 'Noto Serif KR', serif; }
                    .gate-card p { color: #666; margin-bottom: 2rem; }
                    .upgrade-btn { background: #000; color: white; padding: 1rem 2rem; border: none; border-radius: 50px; font-weight: 700; cursor: pointer; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="detail-container">
            <nav className="detail-nav">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Home</Link>
                <div className="pro-badge"><Crown size={14} /> PRO EXCLUSIVE</div>
            </nav>

            <section className="detail-content">
                <div className="culture-hero">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="culture-intro-card">
                        <h1>Beyond the Surface</h1>
                        <p>Understanding the "Jeong" (정) and "Nunchi" (눈치) of Korean society.</p>
                    </motion.div>
                </div>

                <div className="content-grid">
                    <div className="article">
                        <h3>1. The Art of Nunchi</h3>
                        <p>Nunchi is the Korean art of gauging others' thoughts and feelings to create harmony. In a restaurant, it's why the server knows you need water before you ask.</p>
                        <div className="pro-callout">
                            <strong>PRO TIP:</strong> When entering a home, always look at the floor. If you see shoes, take yours off.
                        </div>
                    </div>

                    <div className="article">
                        <h3>2. Essential Phrase Audio</h3>
                        <div className="phrase-audio-list">
                            {[
                                { kr: "맛있어요!", en: "It's delicious!", rom: "Mat-is-eo-yo" },
                                { kr: "진짜요?", en: "Really?", rom: "Jin-jja-yo?" }
                            ].map((p, i) => (
                                <div key={i} className="audio-item">
                                    <div className="audio-info">
                                        <strong>{p.kr}</strong>
                                        <span>{p.en} ({p.rom})</span>
                                    </div>
                                    <button className="play-btn"><Play size={14} fill="currentColor" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .detail-container { background: #FDFCF8; min-height: 100vh; font-family: 'Inter', sans-serif; }
                .detail-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 8%; background: white; border-bottom: 1px solid #eee; }
                .back-link { text-decoration: none; color: #666; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; }
                .pro-badge { background: #000; color: #D4AF37; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 0.4rem; }
                
                .culture-hero { padding: 4rem 8% 2rem; }
                .culture-intro-card { background: white; padding: 4rem; border-radius: 40px; text-align: center; box-shadow: 0 40px 80px rgba(0,0,0,0.05); border: 1px solid #ffecad; }
                .culture-intro-card h1 { font-family: 'Noto Serif KR', serif; font-size: 3rem; margin-bottom: 1rem; color: #1a1a1a; }
                .culture-intro-card p { font-size: 1.2rem; color: #666; font-weight: 300; }

                .content-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; padding: 0 8% 5rem; }
                .article { background: white; padding: 2.5rem; border-radius: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
                .article h3 { font-size: 1.4rem; margin-bottom: 1.5rem; color: #D4AF37; font-weight: 800; }
                .article p { line-height: 1.8; color: #444; margin-bottom: 2rem; }

                .pro-callout { background: #000; color: white; padding: 2rem; border-radius: 24px; font-size: 0.95rem; line-height: 1.6; }
                
                .phrase-audio-list { display: flex; flex-direction: column; gap: 1rem; }
                .audio-item { display: flex; justify-content: space-between; align-items: center; background: #fdfcf8; padding: 1.2rem; border-radius: 20px; border: 1px solid #eee; }
                .audio-info { display: flex; flex-direction: column; gap: 0.2rem; }
                .audio-info strong { font-size: 1.1rem; }
                .audio-info span { font-size: 0.85rem; color: #888; }
                
                .play-btn { width: 36px; height: 36px; border-radius: 50%; border: none; background: #D4AF37; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }

                @media (max-width: 900px) {
                    .content-grid { grid-template-columns: 1fr; }
                    .culture-intro-card h1 { font-size: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default CultureDetail;
