import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ArrowLeft, Play, Lock, BookOpen, Volume2, CheckCircle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const KoreanLessonsDetail = () => {
    const { isPremium } = useAuth();
    const navigate = useNavigate();

    const lessons = [
        {
            id: 1,
            title: "Greeting & Etiquette (Free Preview)",
            isFree: true,
            content: [
                { kr: "안녕하세요", rom: "An-nyeong-ha-se-yo", en: "Hello/Good morning" },
                { kr: "감사합니다", rom: "Gam-sa-ham-ni-da", en: "Thank you" },
                { kr: "죄송합니다", rom: "Joe-song-ham-ni-da", en: "I'm sorry" }
            ]
        },
        {
            id: 2,
            title: "Ordering at Restaurants",
            isFree: false,
            content: [
                { kr: "이거 주세요", rom: "I-geo ju-se-yo", en: "Please give me this" },
                { kr: "맵지 않게 해주세요", rom: "Maep-ji anke hae-ju-se-yo", en: "Make it not spicy, please" }
            ]
        },
        {
            id: 3,
            title: "Direction & Transport",
            isFree: false,
            content: [
                { kr: "어디예요?", rom: "Eo-di-ye-yo?", en: "Where is it?" },
                { kr: "여기 세워주세요", rom: "Yeo-gi se-wo-ju-se-yo", en: "Stop here, please" }
            ]
        }
    ];

    return (
        <div className="detail-container">
            <nav className="detail-nav">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Home</Link>
                <span className="page-title">Korean Survival Lessons</span>
            </nav>

            <section className="detail-content">
                <div className="lesson-header">
                    <BookOpen size={40} color="#D4AF37" />
                    <h1>Speak the Heart of Korea</h1>
                    <p>Practical phrases designed for travelers, not just students.</p>
                </div>

                <div className="lessons-grid">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className={`lesson-card ${!lesson.isFree && !isPremium ? 'locked-card' : ''}`}>
                            <div className="card-header-row">
                                <h3>{lesson.title}</h3>
                                {!lesson.isFree && !isPremium && <Crown size={18} color="#D4AF37" />}
                            </div>

                            {lesson.isFree || isPremium ? (
                                <div className="phrase-list">
                                    {lesson.content.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="phrase-item"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <div className="phrase-text">
                                                <span className="hangul">{item.kr}</span>
                                                <span className="roman">{item.rom}</span>
                                                <span className="english">{item.en}</span>
                                            </div>
                                            <button className="audio-btn">
                                                <Volume2 size={16} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="lock-overlay">
                                    <Lock size={32} color="#D4AF37" style={{ marginBottom: '1rem' }} />
                                    <p>This course is available for PRO members only.</p>
                                    <button onClick={() => navigate('/')} className="card-upgrade-btn">Unlock All Lessons</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <style jsx>{`
        .detail-container { background: #FDFCF8; min-height: 100vh; font-family: 'Inter', sans-serif; padding-bottom: 5rem; }
        .detail-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 8%; background: white; border-bottom: 1px solid #eee; }
        .back-link { text-decoration: none; color: #666; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; }
        .page-title { color: #D4AF37; font-weight: 800; font-size: 0.9rem; letter-spacing: 1px; text-transform: uppercase; }
        
        .detail-content { padding: 4rem 8%; max-width: 900px; margin: 0 auto; }
        .lesson-header { text-align: center; margin-bottom: 4rem; }
        .lesson-header h1 { font-size: 2.2rem; margin: 1rem 0; font-family: 'Noto Serif KR', serif; }
        
        .lessons-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
        .lesson-card { background: white; padding: 3rem; border-radius: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #f0f0f0; position: relative; }
        .card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .lesson-card h3 { color: #1a1a1a; font-size: 1.5rem; font-weight: 800; margin: 0; }
        
        .phrase-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .phrase-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid #f9f9f9; }
        .phrase-item:last-child { border-bottom: none; }
        
        .phrase-text { display: flex; flex-direction: column; gap: 0.2rem; }
        .hangul { font-size: 1.4rem; font-weight: 800; color: #333; }
        .roman { font-size: 0.95rem; color: #D4AF37; font-weight: 600; font-style: italic; }
        .english { font-size: 0.95rem; color: #888; }
        
        .audio-btn { width: 44px; height: 44px; border-radius: 50%; border: none; background: #fdfcf8; color: #D4AF37; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
        .audio-btn:hover { background: #D4AF37; color: white; transform: scale(1.1); }

        .locked-card { background: #f9f9f9; }
        .lock-overlay { padding: 2rem 0; text-align: center; color: #666; }
        .card-upgrade-btn { background: #000; color: white; padding: 0.8rem 2rem; border: none; border-radius: 50px; font-weight: 700; cursor: pointer; margin-top: 1rem; transition: 0.3s; }
        .card-upgrade-btn:hover { transform: scale(1.05); background: #333; }
      `}</style>
        </div>
    );
};

export default KoreanLessonsDetail;
