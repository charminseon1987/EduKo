import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ArrowLeft, MapPin, Star, Navigation, Crown, Camera, Coffee, Utensils, Sparkles, CheckCircle2, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DestinationsDetail = () => {
    const { isPremium } = useAuth();
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState(null);
    const [activeDay, setActiveDay] = useState(1);
    const [dailyItinerary, setDailyItinerary] = useState({ 1: [] });
    const [numDays, setNumDays] = useState(1);

    const toggleItinerary = (spot) => {
        const currentDayRoute = dailyItinerary[activeDay] || [];
        if (currentDayRoute.find(s => s.id === spot.id)) {
            setDailyItinerary({
                ...dailyItinerary,
                [activeDay]: currentDayRoute.filter(s => s.id !== spot.id)
            });
        } else {
            setDailyItinerary({
                ...dailyItinerary,
                [activeDay]: [...currentDayRoute, spot]
            });
        }
    };

    const addDay = () => {
        const nextDay = numDays + 1;
        setNumDays(nextDay);
        setDailyItinerary({ ...dailyItinerary, [nextDay]: [] });
        setActiveDay(nextDay);
    };

    const itinerary = dailyItinerary[activeDay] || [];

    const travelerTypes = [
        { id: 'history', label: 'History Buff', icon: <Camera size={24} />, color: '#D4AF37' },
        { id: 'trend', label: 'Trendsetter', icon: <Sparkles size={24} />, color: '#FF70A6' },
        { id: 'foodie', label: 'Foodie', icon: <Utensils size={24} />, color: '#4ECDC4' }
    ];

    const spots = [
        {
            id: 1,
            title: "Gyeongbokgung Palace",
            type: "history",
            desc: "The heartbeat of Joseon dynasty. Wear a Hanbok for free entry!",
            lat: "30%", lng: "40%",
            rating: 4.8,
            isPro: false
        },
        {
            id: 2,
            title: "Bukchon Hanok Village",
            type: "history",
            desc: "Live history. Quiet alleys with 600 years of stories.",
            lat: "35%", lng: "45%",
            rating: 4.7,
            isPro: false
        },
        {
            id: 3,
            title: "Seongsu-dong Cafes",
            type: "trend",
            desc: "Industrial chic meets high fashion. The 'Brooklyn' of Seoul.",
            lat: "55%", lng: "75%",
            rating: 4.9,
            isPro: true
        },
        {
            id: 4,
            title: "Euljiro 'Hip-jiro' Bars",
            type: "trend",
            desc: "Secret alleys, neon lights, and unmatched retro vibes.",
            lat: "48%", lng: "58%",
            rating: 5.0,
            isPro: true
        },
        {
            id: 5,
            title: "Gwangjang Market",
            type: "foodie",
            desc: "The ultimate street food paradise. Mung bean pancakes are a must.",
            lat: "45%", lng: "60%",
            rating: 4.8,
            isPro: false
        },
        {
            id: 6,
            title: "Hidden Speakeasy in Yeonnam",
            type: "foodie",
            desc: "Enter through a vintage vending machine. Best cocktails in town.",
            lat: "38%", lng: "25%",
            rating: 4.9,
            isPro: true
        }
    ];

    const filteredSpots = selectedType ? spots.filter(s => s.type === selectedType) : spots;

    return (
        <div className="dest-container">
            <nav className="dest-nav">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Home</Link>
                <div className="pro-badge"><Crown size={14} /> PRO EXPLORER</div>
            </nav>

            <header className="dest-header">
                <div className="dest-intro">
                    <h1>Who Are You in Seoul?</h1>
                    <p>Tell us your travel vibe, and we'll unlock your perfect Seoul course.</p>
                </div>

                <div className="personality-selector">
                    {travelerTypes.map(type => (
                        <button
                            key={type.id}
                            className={`type-btn ${selectedType === type.id ? 'active' : ''}`}
                            onClick={() => setSelectedType(type.id)}
                            style={{ '--accent': type.color }}
                        >
                            {type.icon}
                            <span>{type.label}</span>
                            {selectedType === type.id && <CheckCircle2 className="check" size={16} />}
                        </button>
                    ))}
                </div>
                <div className="day-configurator">
                    <div className="day-tabs">
                        {Array.from({ length: numDays }, (_, i) => i + 1).map(day => (
                            <button
                                key={day}
                                className={`day-pill ${activeDay === day ? 'active' : ''}`}
                                onClick={() => setActiveDay(day)}
                            >
                                Day {day}
                            </button>
                        ))}
                        <button className="add-day-btn" onClick={addDay}><Plus size={16} /> Add Day</button>
                    </div>
                </div>
            </header>

            <section className="map-section">
                <div className="map-canvas">
                    <img src="/map_premium.png" alt="Seoul Premium Map" className="base-map" />
                    <AnimatePresence>
                        {filteredSpots.map(spot => {
                            const routeIndex = itinerary.findIndex(s => s.id === spot.id);
                            const isActive = routeIndex !== -1;

                            return (
                                <motion.div
                                    key={spot.id}
                                    className={`map-pin-container ${spot.isPro ? 'pro-pin' : ''} ${isActive ? 'active-route-pin' : ''}`}
                                    style={{ top: spot.lat, left: spot.lng }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    onClick={() => toggleItinerary(spot)}
                                >
                                    <div className="pin-point">
                                        <MapPin size={isActive ? 28 : 20} fill="currentColor" />
                                        {spot.isPro && !isActive && <Crown size={10} className="pin-crown" />}
                                        {isActive && <span className="route-number">{routeIndex + 1}</span>}
                                    </div>
                                    <div className="pin-label">{spot.title}</div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </section>

            <section className="recommendations-section">
                <div className="section-head">
                    <h2>{selectedType ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Favorites` : "Recommended for You"}</h2>
                    <p>Hand-picked spots based on your personality.</p>
                </div>

                <div className="spots-grid">
                    {filteredSpots.map((spot, idx) => {
                        const inRoute = itinerary.find(s => s.id === spot.id);
                        return (
                            <motion.div
                                key={spot.id}
                                className={`spot-card ${spot.isPro ? 'is-pro' : ''} ${inRoute ? 'in-route' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="card-tag">
                                    {spot.isPro ? (
                                        <span className="pro-tag"><Crown size={12} /> PRO SECRET</span>
                                    ) : (
                                        <span className="free-tag">EXPLORE</span>
                                    )}
                                </div>
                                <h3>{spot.title}</h3>
                                <p>{spot.desc}</p>

                                <div className="card-footer">
                                    <div className="rating">
                                        <Star size={14} fill={KJ_GOLD} color={KJ_GOLD} />
                                        <span>{spot.rating}</span>
                                    </div>
                                    <div className="actions-cluster">
                                        {spot.isPro && !isPremium ? (
                                            <button onClick={() => navigate('/')} className="action-btn unlock">Unlock</button>
                                        ) : (
                                            <button
                                                className={`route-btn ${inRoute ? 'added' : ''}`}
                                                onClick={() => toggleItinerary(spot)}
                                            >
                                                {inRoute ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                                                {inRoute ? 'Added' : 'Add to Route'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            <AnimatePresence>
                {Object.values(dailyItinerary).some(day => day.length > 0) && (
                    <motion.div
                        className="route-summary-panel"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                    >
                        <div className="summary-header">
                            <div className="summary-title">
                                <Navigation size={20} />
                                <h3>Day {activeDay} Itinerary</h3>
                            </div>
                            <div className="summary-stats">
                                <span className="count-badge">{itinerary.length} Spots</span>
                                <span className="total-days">{numDays} Days Total</span>
                            </div>
                        </div>
                        <div className="route-track">
                            {itinerary.length > 0 ? (
                                itinerary.map((s, i) => (
                                    <React.Fragment key={s.id}>
                                        <div className="track-step">
                                            <span className="step-num">{i + 1}</span>
                                            <span className="step-name">{s.title}</span>
                                            <button onClick={() => toggleItinerary(s)} className="step-remove"><X size={12} /></button>
                                        </div>
                                        {i < itinerary.length - 1 && <div className="track-line" />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <p className="empty-route-msg">Add spots to Day {activeDay} from the list above!</p>
                            )}
                        </div>
                        <button className="finalize-btn" onClick={() => {
                            localStorage.setItem('kj_itinerary', JSON.stringify(dailyItinerary));
                            localStorage.setItem('kj_days', numDays);
                            navigate('/itinerary');
                        }}>Optimize Full {numDays}-Day Trip</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .dest-container { background: #FDFCF8; min-height: 100vh; font-family: 'Inter', sans-serif; padding-bottom: 5rem; }
                .dest-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 8%; background: white; border-bottom: 1px solid #eee; sticky top: 0; z-index: 100; }
                .back-link { text-decoration: none; color: #1a1a1a; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
                .pro-badge { background: #000; color: #D4AF37; padding: 0.4rem 0.8rem; border-radius: 50px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 0.4rem; }

                .dest-header { padding: 4rem 8% 2rem; text-align: center; }
                .dest-intro h1 { font-family: 'Noto Serif KR', serif; font-size: 3rem; font-weight: 800; margin-bottom: 1rem; color: #000; }
                .dest-intro p { font-size: 1.2rem; color: #1a1a1a; margin-bottom: 3rem; font-weight: 500; }

                .personality-selector { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 2rem; }
                .type-btn { background: white; border: 2px solid #eee; padding: 1.5rem 2rem; border-radius: 28px; display: flex; flex-direction: column; align-items: center; gap: 0.8rem; cursor: pointer; transition: 0.4s; position: relative; width: 160px; box-shadow: 0 10px 25px rgba(0,0,0,0.02); }
                .type-btn span { font-weight: 800; color: #1a1a1a; font-size: 0.9rem; }
                .type-btn:hover { border-color: var(--accent); transform: translateY(-5px); }
                .type-btn.active { border-color: var(--accent); background: #fdfcf8; transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }
                .type-btn.active span { color: var(--accent); }
                .type-btn.active svg { color: var(--accent); }
                .check { position: absolute; top: 1rem; right: 1rem; color: var(--accent); }

                .day-configurator { margin-top: 2rem; display: flex; justify-content: center; }
                .day-tabs { display: flex; gap: 0.8rem; background: #f0f0f0; padding: 0.5rem; border-radius: 50px; overflow-x: auto; max-width: 90%; }
                .day-pill { border: none; padding: 0.6rem 1.5rem; border-radius: 50px; background: transparent; font-weight: 800; cursor: pointer; transition: 0.3s; color: #666; white-space: nowrap; }
                .day-pill.active { background: #000; color: #D4AF37; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                .add-day-btn { border: 1px dashed #ccc; padding: 0.6rem 1.2rem; border-radius: 50px; background: white; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; color: #888; transition: 0.3s; }
                .add-day-btn:hover { border-color: #000; color: #000; }

                .map-section { padding: 0 8% 4rem; position: relative; }
                .map-canvas { position: relative; width: 100%; height: 500px; border-radius: 40px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.1); border: 2px solid white; }
                .base-map { width: 100%; height: 100%; object-fit: cover; }

                .active-route-pin .pin-point { color: #000; scale: 1.2; }
                .route-number { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -70%); color: white; font-size: 10px; font-weight: 900; pointer-events: none; }

                .route-btn { background: #f0f0f0; border: none; padding: 0.6rem 1.2rem; border-radius: 50px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: 0.3s; }
                .route-btn.added { background: #000; color: white; }
                .route-btn:hover { transform: scale(1.05); }

                .route-summary-panel { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); width: 90%; max-width: 600px; padding: 1.5rem 2rem; border-radius: 32px; box-shadow: 0 30px 60px rgba(0,0,0,0.15); border: 1px solid rgba(212, 175, 55, 0.2); z-index: 1000; }
                .summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }
                .summary-title { display: flex; align-items: center; gap: 0.6rem; color: #000; }
                .summary-title h3 { font-size: 1.1rem; font-weight: 800; margin: 0; }
                .count-badge { background: #000; color: white; padding: 0.2rem 0.6rem; border-radius: 50px; font-size: 0.7rem; font-weight: 800; }
                .total-days { color: #888; font-size: 0.75rem; font-weight: 700; }
                .empty-route-msg { color: #999; font-size: 0.9rem; font-style: italic; margin-bottom: 0.5rem; }

                .route-track { display: flex; align-items: center; gap: 0.5rem; overflow-x: auto; padding-bottom: 1rem; margin-bottom: 1rem; }
                .track-step { display: flex; align-items: center; gap: 0.5rem; background: #f9f9f9; padding: 0.4rem 0.8rem; border-radius: 50px; border: 1px solid #eee; white-space: nowrap; position: relative; }
                .step-num { color: #D4AF37; font-weight: 900; font-size: 0.8rem; }
                .step-name { font-size: 0.85rem; font-weight: 700; color: #333; }
                .step-remove { background: none; border: none; color: #999; cursor: pointer; padding: 2px; }
                .track-line { min-width: 20px; height: 1px; background: #ddd; }
                
                .finalize-btn { width: 100%; padding: 1rem; background: #000; color: #D4AF37; border: none; border-radius: 16px; font-weight: 800; cursor: pointer; transition: 0.3s; }
                .finalize-btn:hover { transform: scale(1.02); opacity: 0.9; }

                @media (max-width: 900px) {
                    .personality-selector { flex-wrap: wrap; }
                    .type-btn { width: 45%; }
                    .map-canvas { height: 350px; }
                    .route-summary-panel { bottom: 1rem; width: 95%; padding: 1rem; }
                }

                @media (max-width: 600px) {
                    .dest-header h1 { font-size: 2.2rem; }
                    .type-btn { width: 100%; }
                }
            `}</style>
        </div>
    );
};

const KJ_GOLD = "#D4AF37";

export default DestinationsDetail;
