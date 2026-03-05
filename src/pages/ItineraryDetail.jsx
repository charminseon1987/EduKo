import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ArrowLeft, Calendar, Navigation, Clock, Volume2, Pencil, RefreshCcw, Headphones, Sparkles, BookOpen, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ItineraryDetail = () => {
    const navigate = useNavigate();
    const [savedItinerary, setSavedItinerary] = useState(null);
    const [activeDay, setActiveDay] = useState(1);
    const [labOpen, setLabOpen] = useState(null); // id of spot being practiced

    useEffect(() => {
        const data = localStorage.getItem('kj_itinerary');
        if (data) {
            try {
                setSavedItinerary(JSON.parse(data));
            } catch (e) {
                console.error("Failed to parse itinerary", e);
            }
        }
    }, []);

    const tripDays = savedItinerary ? Object.keys(savedItinerary).length : 0;
    const currentDaySpots = savedItinerary?.[activeDay] || [];

    return (
        <div className="itinerary-hub">
            <nav className="hub-nav">
                <Link to="/destinations" className="back-link"><ArrowLeft size={18} /> Edit Route</Link>
                <div className="hub-meta">
                    <Calendar size={16} />
                    <span>Your {tripDays}-Day Seoul Adventure</span>
                </div>
            </nav>

            <header className="hub-header">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1>Ready for Seoul?</h1>
                    <p>We've optimized your route. Now, let's practice the language you'll need.</p>
                </motion.div>

                <div className="day-switcher">
                    {Array.from({ length: tripDays }, (_, i) => i + 1).map(day => (
                        <button
                            key={day}
                            className={`day-tab ${activeDay === day ? 'active' : ''}`}
                            onClick={() => {
                                setActiveDay(day);
                                setLabOpen(null);
                            }}
                        >
                            DAY {day}
                        </button>
                    ))}
                </div>
            </header>

            <main className="hub-content">
                <div className="itinerary-column">
                    <div className="section-label">THE MASTER PLAN</div>
                    <div className="timeline">
                        {currentDaySpots.length > 0 ? (
                            currentDaySpots.map((spot, i) => (
                                <motion.div
                                    key={spot.id}
                                    className={`timeline-card ${labOpen === spot.id ? 'active-lab' : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="time-marker">
                                        <span className="num">{i + 1}</span>
                                        <div className="line"></div>
                                    </div>
                                    <div className="spot-info">
                                        <div className="spot-header">
                                            <h3>{spot.title}</h3>
                                            <button className="practice-trigger" onClick={() => setLabOpen(spot.id)}>
                                                <BookOpen size={14} /> Practice Korean
                                            </button>
                                        </div>
                                        <p>{spot.desc}</p>
                                        <div className="spot-meta">
                                            <Clock size={12} /> <span>Best at {9 + i * 3}:00 AM</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <h3>No spots yet!</h3>
                                <p>Go back to the destinations page to build your Day {activeDay} route.</p>
                                <button onClick={() => navigate('/destinations')} className="return-btn">Go to Builder</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lab-column">
                    <AnimatePresence mode="wait">
                        {labOpen ? (
                            <motion.div
                                key={labOpen}
                                className="dictation-lab"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <DictationComponent
                                    spot={currentDaySpots.find(s => s.id === labOpen)}
                                    onClose={() => setLabOpen(null)}
                                />
                            </motion.div>
                        ) : (
                            <div className="lab-placeholder">
                                <Headphones size={48} />
                                <h3>Korean Dictation Lab</h3>
                                <p>Select a destination on the left to start practicing target phrases for that location.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <style jsx>{`
                .itinerary-hub { background: #FDFCF8; min-height: 100vh; padding-bottom: 5rem; font-family: 'Inter', sans-serif; }
                .hub-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 8%; background: white; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 100; }
                .back-link { text-decoration: none; color: #1a1a1a; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
                .hub-meta { display: flex; align-items: center; gap: 0.6rem; font-weight: 800; color: #D4AF37; font-size: 0.8rem; letter-spacing: 1px; }

                .hub-header { padding: 4rem 8% 2rem; text-align: center; }
                .hub-header h1 { font-family: 'Noto Serif KR', serif; font-size: 3.2rem; margin-bottom: 1rem; color: #000; font-weight: 800; }
                .hub-header p { font-size: 1.15rem; color: #666; margin-bottom: 3rem; font-weight: 500; }

                .day-switcher { display: flex; justify-content: center; gap: 1rem; }
                .day-tab { padding: 0.8rem 2.2rem; border-radius: 50px; border: 1px solid #eee; background: white; font-weight: 800; cursor: pointer; transition: 0.3s; color: #888; }
                .day-tab.active { background: #000; color: #D4AF37; border-color: #000; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }

                .hub-content { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; padding: 0 8%; max-width: 1400px; margin: 0 auto; }
                .section-label { font-size: 0.75rem; font-weight: 900; color: #D4AF37; letter-spacing: 3px; margin-bottom: 2rem; border-bottom: 2px solid #FFF1B8; padding-bottom: 0.5rem; display: inline-block; }
                
                .timeline { display: flex; flex-direction: column; gap: 2rem; }
                .timeline-card { display: flex; gap: 2rem; padding: 2rem; background: white; border-radius: 32px; border: 1px solid #eee; transition: 0.4s; }
                .timeline-card.active-lab { border-color: #D4AF37; box-shadow: 0 20px 40px rgba(212, 175, 55, 0.1); transform: scale(1.02); }
                .time-marker { display: flex; flex-direction: column; align-items: center; }
                .num { width: 36px; height: 36px; background: #000; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem; }
                .line { width: 2px; flex: 1; background: #f0f0f0; margin-top: 1rem; border-radius: 2px; }

                .spot-info { flex: 1; }
                .spot-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
                .spot-header h3 { font-size: 1.5rem; font-weight: 800; color: #000; margin: 0; }
                .practice-trigger { background: #000; color: #D4AF37; border: none; padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.75rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.3s; }
                .practice-trigger:hover { transform: scale(1.05); }
                .spot-info p { font-size: 1rem; color: #444; line-height: 1.7; margin-bottom: 1.5rem; font-weight: 500; }
                .spot-meta { display: flex; align-items: center; gap: 0.5rem; color: #999; font-size: 0.85rem; font-weight: 700; }

                .lab-column { background: white; border-radius: 40px; border: 2px solid #eee; overflow: hidden; position: sticky; top: 100px; height: 650px; box-shadow: 0 40px 80px rgba(0,0,0,0.03); }
                .lab-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem; }
                .lab-placeholder svg { color: #eee; margin-bottom: 1.5rem; }
                .lab-placeholder h3 { color: #888; font-family: 'Noto Serif KR', serif; font-size: 1.8rem; margin-bottom: 1rem; }
                .lab-placeholder p { color: #aaa; font-size: 1rem; line-height: 1.7; max-width: 300px; }

                .empty-state { text-align: center; padding: 4rem 2rem; background: #fff; border-radius: 32px; border: 2px dashed #eee; }
                .empty-state h3 { font-weight: 800; margin-bottom: 0.5rem; }
                .empty-state p { color: #888; margin-bottom: 2rem; }
                .return-btn { background: #000; color: white; padding: 0.8rem 2rem; border-radius: 50px; border: none; font-weight: 800; cursor: pointer; }

                @media (max-width: 1100px) {
                    .hub-content { grid-template-columns: 1fr; }
                    .lab-column { position: static; height: auto; min-height: 600px; }
                }
            `}</style>
        </div>
    );
};

const DictationComponent = ({ spot, onClose }) => {
    const [status, setStatus] = useState('idle'); // idle, typing, correct, wrong
    const [inputValue, setInputValue] = useState('');
    const [showHint, setShowHint] = useState(false);

    // Dynamic phrase generator based on spot type/name
    const scripts = {
        history: {
            phrase: "궁궐 안에 한복 대여점이 있나요?",
            roman: "Gung-gwol an-e han-bok dae-yeo-jeom-i it-na-yo?",
            eng: "Is there a Hanbok rental shop inside the palace?",
            audio: "/audio/palace_rental.mp3"
        },
        trend: {
            phrase: "여기 시그니처 메뉴가 뭐예요?",
            roman: "Yeo-gi sig-ni-cheo me-nyu-ga mwo-ye-yo?",
            eng: "What is the signature menu here?",
            audio: "/audio/cafe_menu.mp3"
        },
        foodie: {
            phrase: "이것 좀 더 주실 수 있나요?",
            roman: "I-geot jom deo ju-sil su it-na-yo?",
            eng: "Could I have a bit more of this?",
            audio: "/audio/market_extra.mp3"
        }
    };

    const target = scripts[spot.type] || scripts.history;

    const handleCheck = () => {
        // Simple normalization for basic punctuation/spaces
        const normalizedInput = inputValue.trim().replace(/[.,?!]/g, "");
        const normalizedTarget = target.phrase.trim().replace(/[.,?!]/g, "");

        if (normalizedInput === normalizedTarget) {
            setStatus('correct');
        } else {
            setStatus('wrong');
        }
    };

    return (
        <div className="dict-card">
            <div className="dict-head">
                <div className="location-info">
                    <Sparkles size={14} color="#D4AF37" />
                    <span>Level: Travel Survival at {spot.title}</span>
                </div>
                <button className="close-btn" onClick={onClose}><X size={18} /></button>
            </div>

            <div className="audio-stage">
                <motion.div
                    className={`play-sphere ${status === 'correct' ? 'celebrate' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        // Mocking audio play
                        const synth = window.speechSynthesis;
                        if (synth) {
                            const utter = new SpeechSynthesisUtterance(target.phrase);
                            utter.lang = 'ko-KR';
                            utter.rate = 0.8;
                            synth.speak(utter);
                        }
                        if (status === 'idle' || status === 'wrong') setStatus('typing');
                    }}
                >
                    <Volume2 size={40} color="#fff" />
                    <div className="ripple"></div>
                    {status === 'correct' && <motion.div className="confetti" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>✨</motion.div>}
                </motion.div>
                <h3>Listen & Transcribe</h3>
                <p>Listen to the phrase and type it in Korean below.</p>
            </div>

            <div className="input-stage">
                <textarea
                    placeholder="듣고 따라 적어보세요 (Type what you hear...)"
                    value={inputValue}
                    spellCheck="false"
                    readOnly={status === 'correct'}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        if (status !== 'idle' && status !== 'correct') setStatus('typing');
                    }}
                />

                <div className="dict-actions">
                    <button className="hint-btn" onClick={() => setShowHint(!showHint)}>
                        <RefreshCcw size={14} /> {showHint ? "Hide Script" : "Show Script"}
                    </button>
                    <button
                        className={`check-btn ${status}`}
                        onClick={handleCheck}
                        disabled={!inputValue.trim() || status === 'correct'}
                    >
                        {status === 'correct' ? <CheckCircle size={18} /> : <Pencil size={18} />}
                        {status === 'correct' ? 'Perfectly Done!' : status === 'wrong' ? 'Try Again' : 'Verify My Dictation'}
                    </button>
                </div>

                <AnimatePresence>
                    {showHint && (
                        <motion.div
                            className="hint-box"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                        >
                            <div className="hint-item">
                                <span className="label">TARGET SCRIPT</span>
                                <p className="korean-script">{target.phrase}</p>
                            </div>
                            <div className="hint-item">
                                <span className="label">ENGLISH MEANING</span>
                                <p>{target.eng}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {status === 'correct' && (
                    <motion.div
                        className="feedback-success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Sparkles size={24} />
                        <div>
                            <strong>Mastered!</strong>
                            <p>You can now handle this conversation at {spot.title}.</p>
                        </div>
                    </motion.div>
                )}
            </div>

            <style jsx>{`
                .dict-card { padding: 3rem; height: 100%; display: flex; flex-direction: column; background: #fff; }
                .dict-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
                .location-info { display: flex; align-items: center; gap: 0.6rem; color: #D4AF37; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase; }
                .close-btn { background: #f9f9f9; border: none; color: #bbb; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .close-btn:hover { background: #eee; color: #000; }

                .audio-stage { text-align: center; margin-bottom: 3rem; }
                .play-sphere { width: 110px; height: 110px; background: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; cursor: pointer; position: relative; box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
                .play-sphere.celebrate { background: #22C55E; box-shadow: 0 15px 35px rgba(34, 197, 94, 0.3); }
                .ripple { position: absolute; width: 100%; height: 100%; border: 3px solid #000; border-radius: 50%; animation: ripple 2s infinite; opacity: 0; }
                @keyframes ripple {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.6); opacity: 0; }
                }
                .confetti { position: absolute; font-size: 2rem; top: -10px; right: -10px; }
                .audio-stage h3 { font-weight: 800; font-size: 1.6rem; margin-bottom: 0.5rem; color: #000; font-family: 'Noto Serif KR', serif; }
                .audio-stage p { font-size: 1rem; color: #888; font-weight: 500; }

                .input-stage { flex: 1; display: flex; flex-direction: column; }
                textarea { width: 100%; height: 120px; padding: 1.5rem; border-radius: 24px; border: 2px solid #f0f0f0; background: #fdfcf8; font-family: 'Noto Sans KR', sans-serif; font-size: 1.25rem; font-weight: 600; resize: none; margin-bottom: 1.5rem; transition: 0.4s; color: #000; }
                textarea:focus { border-color: #000; background: white; outline: none; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
                textarea:read-only { background: #f9f9f9; color: #22C55E; border-color: #22C55E; }
                
                .dict-actions { display: flex; justify-content: space-between; gap: 1.5rem; margin-bottom: 2rem; }
                .hint-btn { background: none; border: none; color: #999; font-weight: 800; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
                .check-btn { flex: 1; padding: 1.2rem; border-radius: 18px; border: none; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.8rem; transition: 0.3s; font-size: 1rem; }
                .check-btn.typing { background: #000; color: #D4AF37; }
                .check-btn.correct { background: #22C55E; color: white; }
                .check-btn.wrong { background: #EF4444; color: white; animation: shake 0.4s; }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .check-btn:disabled { background: #f5f5f5; color: #ccc; cursor: not-allowed; }

                .hint-box { background: #fffdf5; border-radius: 20px; padding: 1.5rem; border: 1px solid #FFE58F; margin-bottom: 2rem; }
                .hint-item { margin-bottom: 1.2rem; }
                .hint-item:last-child { margin-bottom: 0; }
                .label { font-size: 0.7rem; font-weight: 900; color: #D4AF37; letter-spacing: 2px; display: block; margin-bottom: 0.4rem; }
                .hint-item p { font-size: 0.95rem; color: #000; font-weight: 700; line-height: 1.5; }
                .korean-script { font-size: 1.2rem !important; color: #D4AF37 !important; }

                .feedback-success { background: #F0FDFA; border: 2px solid #5EEAD4; padding: 1.5rem; border-radius: 24px; display: flex; gap: 1.2rem; color: #0D9488; align-items: center; }
                .feedback-success strong { font-size: 1.2rem; display: block; margin-bottom: 0.2rem; }
                .feedback-success p { font-size: 0.9rem; margin: 0; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default ItineraryDetail;
