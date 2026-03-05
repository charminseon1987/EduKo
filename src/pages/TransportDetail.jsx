import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, ArrowLeft, Train, Bus, CreditCard, ChevronRight, Info, Map, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TransportDetail = () => {
    // Definitive order using an array
    const transportOptions = [
        {
            id: 'subway',
            icon: <Train size={32} />,
            title: "Seoul Metro",
            subtitle: "The Lifeline of Seoul",
            description: "World-class, efficient, and incredibly clean. Covering 23 lines and hundreds of stations.",
            tips: [
                "Apps: Download 'KakaoMetro' or 'Naver Map'. English support is excellent.",
                "Colors: Each line has a distinct color. Just follow the floor lines!",
                "Seats: Avoid pink seats (Pregnant women) and end-of-row seats (Elderly) even if empty.",
                "Last Train: Usually around midnight. Check the app for exact times."
            ],
            image: "/subway.png"
        },
        {
            id: 'bus',
            icon: <Bus size={32} />,
            title: "City Bus",
            subtitle: "Go Where Trains Can't",
            description: "An extensive network of colored buses. Essential for reaching hilly neighborhoods and specific alleys.",
            tips: [
                "Colors: Blue (Long distance), Green (Local), Yellow (Circular), Red (Express to suburbs).",
                "Tagging: You MUST tag your card when getting ON and OFF to avoid extra charges.",
                "Bell: Press the 'Stop' button before your station.",
                "Boarding: Only through the front door. Exit through the middle door."
            ],
            image: "/bus.png"
        },
        {
            id: 'tmoney',
            icon: <CreditCard size={32} />,
            title: "T-Money Card",
            subtitle: "One Card to Rule Them All",
            description: "The universal transit card for Korea. It works for subways, buses, taxis, and even convenience stores.",
            tips: [
                "Purchase: Any convenience store (CU, GS25, 7-Eleven) for ~4,000 KRW.",
                "Top-up: Cash only at stations or convenience stores.",
                "Refund: Remaining balance can be refunded at convenience stores (small fee applies).",
                "Design: Look for 'K-Pop' or 'Kakao Friends' special editions!"
            ],
            image: "/tmoney.png"
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const activeData = transportOptions[activeIndex];

    return (
        <div className="detail-container">
            <nav className="detail-nav">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Home</Link>
                <div className="nav-title">TRANSPORT GUIDE</div>
            </nav>

            <header className="transport-header">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    Mastering Seoul's Transit
                </motion.h1>
                <p>Everything you need to navigate like a local expert.</p>
            </header>

            <div className="tab-control">
                {transportOptions.map((opt, idx) => (
                    <button
                        key={opt.id}
                        className={`tab-btn ${activeIndex === idx ? 'active' : ''}`}
                        onClick={() => setActiveIndex(idx)}
                    >
                        {opt.icon}
                        <span>{opt.title}</span>
                    </button>
                ))}
            </div>

            <main className="transport-main">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeData.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="transport-content"
                    >
                        <div className="content-visual">
                            <img src={activeData.image} alt={activeData.title} />
                            <div className="visual-overlay">
                                <h3>{activeData.subtitle}</h3>
                            </div>
                        </div>

                        <div className="content-text">
                            <div className="description-block">
                                <h2>{activeData.title}</h2>
                                <p>{activeData.description}</p>
                            </div>

                            <div className="tips-block">
                                <h4><Info size={18} /> Pro Tips for Travelers</h4>
                                <div className="tips-list">
                                    {activeData.tips.map((tip, i) => (
                                        <div key={i} className="tip-item">
                                            <CheckCircle size={14} color="#D4AF37" />
                                            <span>{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="status-banner">
                                <AlertCircle size={16} />
                                <span>Real-time status available for PRO members</span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            <style jsx>{`
                .detail-container { background: #FDFCF8; min-height: 100vh; font-family: 'Inter', sans-serif; color: #1a1a1a; }
                .detail-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 8%; background: white; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 100; }
                .back-link { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #666; font-weight: 700; font-size: 0.9rem; }
                .nav-title { font-weight: 900; color: #8A6D1F; font-size: 0.8rem; letter-spacing: 2px; }

                .transport-header { padding: 4rem 8% 2rem; text-align: center; }
                .transport-header h1 { font-family: 'Noto Serif KR', serif; font-size: 3rem; font-weight: 800; margin-bottom: 1rem; }
                .transport-header p { font-size: 1.2rem; color: #666; font-weight: 400; }

                .tab-control { display: flex; justify-content: center; gap: 1rem; padding: 0 8% 3rem; }
                .tab-btn { background: white; border: 1px solid #eee; padding: 1.5rem 2rem; border-radius: 24px; display: flex; flex-direction: column; align-items: center; gap: 0.8rem; cursor: pointer; transition: 0.3s; width: 180px; box-shadow: 0 5px 15px rgba(0,0,0,0.02); outline: none; }
                .tab-btn span { font-weight: 800; font-size: 0.9rem; color: #666; }
                .tab-btn.active { border-color: #8A6D1F; background: #FFFDEA; transform: translateY(-5px); box-shadow: 0 15px 30px rgba(138, 109, 31, 0.15); }
                .tab-btn.active span { color: #8A6D1F; }

                .transport-main { padding: 0 8% 5rem; max-width: 1200px; margin: 0 auto; }
                .transport-content { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: start; }
                
                .content-visual { position: relative; border-radius: 40px; overflow: hidden; height: 500px; box-shadow: 0 40px 80px rgba(0,0,0,0.1); }
                .content-visual img { width: 100%; height: 100%; object-fit: cover; }
                .visual-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 3rem; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); color: white; }
                .visual-overlay h3 { font-size: 1.8rem; margin: 0; font-family: 'Noto Serif KR', serif; font-weight: 700; }

                .content-text { padding-top: 1rem; }
                .description-block h2 { font-size: 2.2rem; font-weight: 900; margin-bottom: 1.5rem; color: #8A6D1F; font-family: 'Noto Serif KR', serif; }
                .description-block p { font-size: 1.1rem; color: #333; line-height: 1.8; margin-bottom: 2.5rem; font-weight: 400; }

                .tips-block { background: white; padding: 2.5rem; border-radius: 32px; border: 1px solid #f0f0f0; box-shadow: 0 10px 40px rgba(0,0,0,0.02); margin-bottom: 2.5rem; }
                .tips-block h4 { display: flex; align-items: center; gap: 0.8rem; font-size: 1.1rem; margin-bottom: 1.5rem; color: #1a1a1a; font-weight: 900; }
                .tips-list { display: flex; flex-direction: column; gap: 1.2rem; }
                .tip-item { display: flex; gap: 1rem; align-items: flex-start; line-height: 1.5; font-size: 0.95rem; color: #1a1a1a; font-weight: 500; }

                .status-banner { display: flex; align-items: center; gap: 0.8rem; padding: 1rem 1.5rem; background: #000; color: #D4AF37; border-radius: 12px; font-size: 0.85rem; font-weight: 700; border-left: 4px solid #D4AF37; }

                @media (max-width: 1000px) {
                    .transport-content { grid-template-columns: 1fr; }
                    .content-visual { height: 350px; }
                    .tab-btn { width: 30%; padding: 1rem; }
                    .tab-btn span { font-size: 0.75rem; }
                }

                @media (max-width: 600px) {
                    .transport-header h1 { font-size: 2rem; }
                    .tab-control { flex-wrap: wrap; }
                    .tab-btn { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default TransportDetail;
