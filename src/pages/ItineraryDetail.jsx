import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ArrowLeft, Calendar, Clock, Volume2, Mic, MicOff, Headphones, Sparkles, BookOpen, CheckCircle, X, GripVertical, MapPin, Navigation, ChevronUp, ChevronDown, RotateCcw, MessageCircle, Send, Bot, Train, Footprints, Bus } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* ── Real Seoul GPS coordinates ── */
const SPOT_COORDS = {
    1: { lat: 37.5796, lng: 126.9770, label: "Gyeongbokgung Palace" },
    2: { lat: 37.5826, lng: 126.9831, label: "Bukchon Hanok Village" },
    3: { lat: 37.5445, lng: 127.0559, label: "Seongsu-dong Cafes" },
    4: { lat: 37.5660, lng: 126.9918, label: "Euljiro Hip-jiro" },
    5: { lat: 37.5700, lng: 126.9994, label: "Gwangjang Market" },
    6: { lat: 37.5665, lng: 126.9218, label: "Yeonnam-dong Speakeasy" },
};

/* Transit info between spots */
const TRANSIT_INFO = {
    '1-2': { mode: 'walk', time: '15min', detail: 'Walk through Samcheong-dong' },
    '2-1': { mode: 'walk', time: '15min', detail: 'Walk south via Samcheong-dong' },
    '1-5': { mode: 'subway', time: '10min', detail: 'Line 3 → Jongno 3-ga' },
    '5-1': { mode: 'subway', time: '10min', detail: 'Jongno 3-ga → Line 3' },
    '1-4': { mode: 'subway', time: '12min', detail: 'Line 3 → Euljiro 3-ga' },
    '4-1': { mode: 'subway', time: '12min', detail: 'Euljiro 3-ga → Line 3' },
    '2-5': { mode: 'walk', time: '20min', detail: 'Walk through Ikseon-dong' },
    '5-2': { mode: 'walk', time: '20min', detail: 'Walk via Ikseon-dong' },
    '4-5': { mode: 'walk', time: '8min', detail: 'Walk east along Euljiro' },
    '5-4': { mode: 'walk', time: '8min', detail: 'Walk west along Euljiro' },
    '4-3': { mode: 'subway', time: '18min', detail: 'Line 2 → Seongsu Station' },
    '3-4': { mode: 'subway', time: '18min', detail: 'Seongsu → Line 2' },
    '1-6': { mode: 'subway', time: '20min', detail: 'Line 3 → Hongdae → Walk' },
    '6-1': { mode: 'subway', time: '20min', detail: 'Walk → Hongdae → Line 3' },
    '5-3': { mode: 'subway', time: '22min', detail: 'Jongno 3-ga → Line 2 → Seongsu' },
    '3-5': { mode: 'subway', time: '22min', detail: 'Seongsu → Line 2 → Jongno 3-ga' },
    '2-4': { mode: 'subway', time: '15min', detail: 'Anguk → Line 3 → Euljiro 3-ga' },
    '6-5': { mode: 'subway', time: '25min', detail: 'Hongdae → Line 2 → Sindang → Line 1' },
    '3-6': { mode: 'subway', time: '30min', detail: 'Seongsu → Line 2 → Hongdae → Walk' },
};

function getTransit(fromId, toId) {
    const key = `${fromId}-${toId}`;
    return TRANSIT_INFO[key] || { mode: 'subway', time: '~20min', detail: 'Subway transfer' };
}

/* Numbered marker icon */
function createNumberedIcon(num) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:36px;height:36px;background:#000;border:3px solid #D4AF37;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#D4AF37;font-weight:900;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">${num}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
}

/* Auto-fit map to markers */
const FitBounds = ({ positions }) => {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [positions, map]);
    return null;
};


const ItineraryDetail = () => {
    const navigate = useNavigate();
    const [savedItinerary, setSavedItinerary] = useState(null);
    const [activeDay, setActiveDay] = useState(1);
    const [labOpen, setLabOpen] = useState(null);
    const [viewMode, setViewMode] = useState('map');

    useEffect(() => {
        const data = localStorage.getItem('kj_itinerary');
        if (data) { try { setSavedItinerary(JSON.parse(data)); } catch (e) { } }
    }, []);

    const persistItinerary = (i) => { setSavedItinerary(i); localStorage.setItem('kj_itinerary', JSON.stringify(i)); };
    const tripDays = savedItinerary ? Object.keys(savedItinerary).length : 0;
    const currentDaySpots = savedItinerary?.[activeDay] || [];
    const handleReorder = (n) => persistItinerary({ ...savedItinerary, [activeDay]: n });
    const moveSpot = (i, dir) => { const a = [...currentDaySpots]; const t = i + dir; if (t < 0 || t >= a.length) return;[a[i], a[t]] = [a[t], a[i]]; handleReorder(a); };

    const optimizeRoute = () => {
        if (currentDaySpots.length < 2) return;
        const coords = currentDaySpots.map(s => SPOT_COORDS[s.id] || { lat: 37.55, lng: 127 });
        const visited = [0]; const remaining = new Set(currentDaySpots.map((_, i) => i)); remaining.delete(0);
        while (remaining.size > 0) {
            const last = visited[visited.length - 1]; let best = -1, bestDist = Infinity;
            for (const r of remaining) { const d = Math.hypot(coords[r].lat - coords[last].lat, coords[r].lng - coords[last].lng); if (d < bestDist) { bestDist = d; best = r; } }
            visited.push(best); remaining.delete(best);
        }
        handleReorder(visited.map(i => currentDaySpots[i]));
    };

    const routePositions = currentDaySpots.map(s => { const c = SPOT_COORDS[s.id]; return c ? [c.lat, c.lng] : [37.55, 127]; });

    return (
        <div className="itinerary-hub">
            <nav className="hub-nav">
                <Link to="/destinations" className="back-link"><ArrowLeft size={18} /> Edit Route</Link>
                <div className="hub-meta"><Calendar size={16} /><span>{tripDays}-Day Seoul Adventure</span></div>
            </nav>

            <header className="hub-header">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1>Your Optimized Route</h1>
                    <p>Real map with directions · Drag to reorder · Practice Korean for each stop</p>
                </motion.div>
                <div className="day-switcher">
                    {Array.from({ length: tripDays }, (_, i) => i + 1).map(day => (
                        <button key={day} className={`day-tab ${activeDay === day ? 'active' : ''}`}
                            onClick={() => { setActiveDay(day); setLabOpen(null); setViewMode('map'); }}>DAY {day}</button>
                    ))}
                </div>
            </header>

            <main className="hub-content">
                {/* ── LEFT: Route list ── */}
                <div className="itinerary-column">
                    <div className="col-header">
                        <div className="section-label">ROUTE ORDER</div>
                        <button className="optimize-btn" onClick={optimizeRoute} disabled={currentDaySpots.length < 2}><RotateCcw size={14} /> Auto-Optimize</button>
                    </div>

                    {currentDaySpots.length > 0 ? (
                        <Reorder.Group axis="y" values={currentDaySpots} onReorder={handleReorder} className="timeline">
                            {currentDaySpots.map((spot, i) => {
                                const transit = i > 0 ? getTransit(currentDaySpots[i - 1].id, spot.id) : null;
                                return (
                                    <React.Fragment key={spot.id}>
                                        {transit && (
                                            <div className="transit-step">
                                                {transit.mode === 'walk' ? <Footprints size={14} /> : transit.mode === 'bus' ? <Bus size={14} /> : <Train size={14} />}
                                                <span>{transit.time} · {transit.detail}</span>
                                            </div>
                                        )}
                                        <Reorder.Item value={spot} className={`timeline-card ${labOpen === spot.id ? 'active-lab' : ''}`}>
                                            <div className="drag-handle"><GripVertical size={18} /></div>
                                            <div className="time-marker">
                                                <span className="num">{i + 1}</span>
                                                {i < currentDaySpots.length - 1 && <div className="line-seg"></div>}
                                            </div>
                                            <div className="spot-info">
                                                <div className="spot-header">
                                                    <h3>{spot.title}</h3>
                                                    <div className="spot-actions">
                                                        <button className="move-btn" onClick={() => moveSpot(i, -1)} disabled={i === 0}><ChevronUp size={16} /></button>
                                                        <button className="move-btn" onClick={() => moveSpot(i, 1)} disabled={i === currentDaySpots.length - 1}><ChevronDown size={16} /></button>
                                                        <button className="practice-trigger" onClick={() => { setLabOpen(spot.id); setViewMode('speak'); }}><Mic size={12} /> 따라말하기</button>
                                                    </div>
                                                </div>
                                                <p>{spot.desc}</p>
                                                <div className="spot-meta"><Clock size={12} /> <span>Stop #{i + 1} · ~{30 + i * 15}min</span></div>
                                            </div>
                                        </Reorder.Item>
                                    </React.Fragment>
                                );
                            })}
                        </Reorder.Group>
                    ) : (
                        <div className="empty-state">
                            <h3>No spots yet!</h3><p>Go back to build your Day {activeDay} route.</p>
                            <button onClick={() => navigate('/destinations')} className="return-btn">Go to Builder</button>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Map / Speech / AI Tutor ── */}
                <div className="right-column">
                    <div className="view-toggle">
                        <button className={viewMode === 'map' ? 'active' : ''} onClick={() => setViewMode('map')}><MapPin size={14} /> Map</button>
                        <button className={viewMode === 'speak' ? 'active' : ''} onClick={() => setViewMode('speak')}><Mic size={14} /> 따라말하기</button>
                        <button className={viewMode === 'tutor' ? 'active' : ''} onClick={() => setViewMode('tutor')}><Bot size={14} /> AI Tutor</button>
                    </div>

                    <AnimatePresence mode="wait">
                        {viewMode === 'map' && (
                            <motion.div key="map" className="map-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="real-map-wrap">
                                    {currentDaySpots.length > 0 ? (
                                        <MapContainer center={[37.5665, 126.9780]} zoom={13} style={{ width: '100%', height: '100%', borderRadius: '28px' }}
                                            scrollWheelZoom={true} zoomControl={false}>
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <FitBounds positions={routePositions} />
                                            {/* Route polyline */}
                                            <Polyline positions={routePositions} pathOptions={{
                                                color: '#D4AF37', weight: 4, dashArray: '10 6', opacity: 0.9
                                            }} />
                                            {/* Numbered markers */}
                                            {currentDaySpots.map((spot, i) => {
                                                const c = SPOT_COORDS[spot.id];
                                                if (!c) return null;
                                                return (
                                                    <Marker key={spot.id} position={[c.lat, c.lng]} icon={createNumberedIcon(i + 1)}>
                                                        <Popup>
                                                            <div style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
                                                                <strong style={{ fontSize: '1rem' }}>{spot.title}</strong>
                                                                <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.5rem 0 0' }}>{spot.desc}</p>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                );
                                            })}
                                        </MapContainer>
                                    ) : (
                                        <div className="map-empty"><MapPin size={40} /><p>Add spots to see your route on the map.</p></div>
                                    )}
                                </div>
                                {/* Route summary with transit */}
                                {currentDaySpots.length > 0 && (
                                    <div className="route-strip">
                                        <div className="strip-label"><Navigation size={14} /><span>Day {activeDay} · Optimal Route</span></div>
                                        <div className="directions-flow">
                                            {currentDaySpots.map((s, i) => {
                                                const transit = i > 0 ? getTransit(currentDaySpots[i - 1].id, s.id) : null;
                                                return (
                                                    <React.Fragment key={s.id}>
                                                        {transit && (
                                                            <div className="dir-transit">
                                                                {transit.mode === 'walk' ? <Footprints size={12} /> : <Train size={12} />}
                                                                <span>{transit.time}</span>
                                                            </div>
                                                        )}
                                                        <div className="dir-stop"><span className="dir-num">{i + 1}</span><span className="dir-name">{s.title}</span></div>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {viewMode === 'speak' && (
                            <motion.div key="speak" className="lab-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                {labOpen ? <SpeechPractice spot={currentDaySpots.find(s => s.id === labOpen)} onClose={() => { setLabOpen(null); setViewMode('map'); }} />
                                    : <div className="lab-placeholder"><Mic size={48} /><h3>듣고 따라말하기</h3><p>Click "따라말하기" on a spot to start voice practice.</p></div>}
                            </motion.div>
                        )}

                        {viewMode === 'tutor' && (
                            <motion.div key="tutor" className="lab-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <AITutor spot={currentDaySpots.length > 0 ? currentDaySpots[0] : null} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <style jsx>{`
                .itinerary-hub { background: #FDFCF8; min-height: 100vh; padding-bottom: 5rem; font-family: 'Inter', sans-serif; }
                .hub-nav { display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 6%; background: white; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 100; }
                .back-link { text-decoration: none; color: #1a1a1a; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
                .hub-meta { display: flex; align-items: center; gap: 0.6rem; font-weight: 800; color: #D4AF37; font-size: 0.8rem; letter-spacing: 1px; }
                .hub-header { padding: 3rem 6% 1.5rem; text-align: center; }
                .hub-header h1 { font-family: 'Noto Serif KR', serif; font-size: 2.8rem; margin-bottom: 0.8rem; color: #000; font-weight: 800; }
                .hub-header p { font-size: 1rem; color: #666; margin-bottom: 2rem; }
                .day-switcher { display: flex; justify-content: center; gap: 0.8rem; }
                .day-tab { padding: 0.7rem 2rem; border-radius: 50px; border: 1px solid #eee; background: white; font-weight: 800; cursor: pointer; transition: 0.3s; color: #888; }
                .day-tab.active { background: #000; color: #D4AF37; border-color: #000; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
                .hub-content { display: grid; grid-template-columns: 1fr 1.4fr; gap: 2.5rem; padding: 2rem 6%; max-width: 1500px; margin: 0 auto; }

                .itinerary-column { max-height: calc(100vh - 200px); overflow-y: auto; padding-right: 0.5rem; }
                .col-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .section-label { font-size: 0.7rem; font-weight: 900; color: #D4AF37; letter-spacing: 3px; }
                .optimize-btn { background: #000; color: #D4AF37; border: none; padding: 0.6rem 1.2rem; border-radius: 50px; font-weight: 800; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
                .optimize-btn:disabled { opacity: 0.3; cursor: not-allowed; }

                .timeline { display: flex; flex-direction: column; gap: 0; list-style: none; padding: 0; margin: 0; }
                .transit-step { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1rem 0.6rem 4.5rem; color: #999; font-size: 0.75rem; font-weight: 700; }
                .transit-step svg { color: #D4AF37; flex-shrink: 0; }

                .timeline-card { display: flex; gap: 1rem; padding: 1.5rem; background: white; border-radius: 24px; border: 1px solid #eee; cursor: grab; user-select: none; margin-bottom: 0; }
                .timeline-card:active { cursor: grabbing; box-shadow: 0 20px 40px rgba(0,0,0,0.1); z-index: 10; }
                .timeline-card.active-lab { border-color: #D4AF37; }
                .drag-handle { color: #ddd; display: flex; align-items: flex-start; padding-top: 0.2rem; }
                .time-marker { display: flex; flex-direction: column; align-items: center; }
                .num { width: 32px; height: 32px; background: #000; color: #D4AF37; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; flex-shrink: 0; }
                .line-seg { width: 2px; flex: 1; background: linear-gradient(to bottom, #D4AF37, #eee); margin-top: 0.5rem; min-height: 20px; }
                .spot-info { flex: 1; min-width: 0; }
                .spot-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem; gap: 0.5rem; }
                .spot-header h3 { font-size: 1.1rem; font-weight: 800; color: #000; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .spot-actions { display: flex; gap: 0.3rem; flex-shrink: 0; }
                .move-btn { background: #f5f5f5; border: none; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #666; }
                .move-btn:disabled { opacity: 0.2; cursor: not-allowed; }
                .practice-trigger { background: #000; color: #D4AF37; border: none; padding: 0.35rem 0.7rem; border-radius: 50px; font-size: 0.7rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.3rem; }
                .spot-info p { font-size: 0.85rem; color: #555; line-height: 1.5; margin-bottom: 0.8rem; }
                .spot-meta { display: flex; align-items: center; gap: 0.4rem; color: #aaa; font-size: 0.75rem; font-weight: 700; }

                .empty-state { text-align: center; padding: 3rem 2rem; background: #fff; border-radius: 24px; border: 2px dashed #eee; }
                .empty-state h3 { font-weight: 800; margin-bottom: 0.5rem; }
                .empty-state p { color: #888; margin-bottom: 1.5rem; }
                .return-btn { background: #000; color: white; padding: 0.7rem 1.5rem; border-radius: 50px; border: none; font-weight: 800; cursor: pointer; }

                .right-column { position: sticky; top: 90px; height: calc(100vh - 200px); display: flex; flex-direction: column; }
                .view-toggle { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
                .view-toggle button { flex: 1; padding: 0.7rem; border-radius: 14px; border: 1px solid #eee; background: white; font-weight: 800; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.4rem; color: #888; }
                .view-toggle button.active { background: #000; color: #D4AF37; border-color: #000; }

                .map-panel { flex: 1; display: flex; flex-direction: column; gap: 1rem; min-height: 0; }
                .real-map-wrap { flex: 1; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.08); border: 2px solid #eee; min-height: 350px; position: relative; }
                .map-empty { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fdfcf8; z-index: 5; color: #bbb; }
                .map-empty p { font-size: 0.9rem; max-width: 250px; margin-top: 1rem; text-align: center; }

                .route-strip { background: white; border-radius: 20px; padding: 1rem 1.5rem; border: 1px solid #eee; }
                .strip-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 800; color: #333; margin-bottom: 0.8rem; }
                .directions-flow { display: flex; flex-direction: column; gap: 0.5rem; }
                .dir-stop { display: flex; align-items: center; gap: 0.6rem; }
                .dir-num { width: 22px; height: 22px; background: #000; color: #D4AF37; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.65rem; flex-shrink: 0; }
                .dir-name { font-size: 0.8rem; font-weight: 700; color: #333; }
                .dir-transit { display: flex; align-items: center; gap: 0.5rem; padding-left: 2.2rem; font-size: 0.7rem; color: #999; font-weight: 600; }
                .dir-transit svg { color: #D4AF37; }

                .lab-panel { flex: 1; background: white; border-radius: 32px; border: 2px solid #eee; overflow: hidden; display: flex; flex-direction: column; }
                .lab-placeholder { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 3rem; }
                .lab-placeholder svg { color: #ddd; margin-bottom: 1.5rem; }
                .lab-placeholder h3 { color: #888; font-family: 'Noto Serif KR', serif; font-size: 1.6rem; margin-bottom: 0.8rem; }
                .lab-placeholder p { color: #aaa; font-size: 0.9rem; line-height: 1.6; max-width: 280px; }

                @media (max-width: 1100px) {
                    .hub-content { grid-template-columns: 1fr; }
                    .right-column { position: static; height: auto; min-height: 500px; }
                    .itinerary-column { max-height: none; }
                }
            `}</style>
        </div>
    );
};


/* ━━━ Listen & Repeat (Speech Recognition) ━━━ */
const SpeechPractice = ({ spot, onClose }) => {
    const [phase, setPhase] = useState('ready');
    const [transcript, setTranscript] = useState('');
    const [showAnswer, setShowAnswer] = useState(false);
    const recognitionRef = useRef(null);

    const scripts = {
        history: { phrase: "궁궐 안에 한복 대여점이 있나요?", eng: "Is there a Hanbok rental inside the palace?" },
        trend: { phrase: "여기 시그니처 메뉴가 뭐예요?", eng: "What is the signature menu here?" },
        foodie: { phrase: "이것 좀 더 주실 수 있나요?", eng: "Could I have more of this?" }
    };
    const target = scripts[spot?.type] || scripts.history;

    const playAudio = () => { const s = window.speechSynthesis; if (s) { const u = new SpeechSynthesisUtterance(target.phrase); u.lang = 'ko-KR'; u.rate = 0.75; s.speak(u); } };

    const startListening = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Speech Recognition not supported. Use Chrome.'); return; }
        const r = new SR(); r.lang = 'ko-KR'; r.interimResults = false; r.maxAlternatives = 3;
        r.onresult = (e) => {
            const norm = (s) => s.replace(/[\s.,?!]/g, '');
            let matched = false;
            for (let i = 0; i < e.results[0].length; i++) { const t = e.results[0][i].transcript; if (norm(t) === norm(target.phrase)) { setTranscript(t); matched = true; break; } }
            if (!matched) { const best = e.results[0][0].transcript; setTranscript(best); const sim = calcSimilarity(norm(best), norm(target.phrase)); matched = sim > 0.65; }
            setPhase(matched ? 'success' : 'fail');
        };
        r.onerror = () => setPhase('fail');
        recognitionRef.current = r; setTranscript(''); setPhase('listening'); r.start();
    };
    const stopListening = () => { if (recognitionRef.current) recognitionRef.current.stop(); };
    if (!spot) return null;

    return (
        <div className="speech-card">
            <div className="speech-head"><div className="loc-tag"><Sparkles size={14} color="#D4AF37" /><span>{spot.title}</span></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div>
            <div className="listen-section">
                <h3>Step 1: Listen</h3>
                <motion.button className="play-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={playAudio}><Volume2 size={28} /> Play Korean</motion.button>
                <button className="reveal-btn" onClick={() => setShowAnswer(!showAnswer)}>{showAnswer ? 'Hide' : 'Show Script'}</button>
                <AnimatePresence>{showAnswer && (<motion.div className="script-reveal" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p className="kr">{target.phrase}</p><p className="en">{target.eng}</p></motion.div>)}</AnimatePresence>
            </div>
            <div className="speak-section">
                <h3>Step 2: Repeat</h3>
                <motion.button className={`mic-btn ${phase === 'listening' ? 'recording' : ''} ${phase === 'success' ? 'ok' : ''}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={phase === 'listening' ? stopListening : startListening}>
                    {phase === 'listening' ? <><MicOff size={28} /> Stop</> : <><Mic size={28} /> {phase === 'success' ? 'Try Again' : 'Start Speaking'}</>}
                </motion.button>
                {transcript && <motion.div className={`transcript-box ${phase}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><span className="label">YOUR VOICE</span><p>{transcript}</p></motion.div>}
                {phase === 'success' && <motion.div className="result-banner ok" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><CheckCircle size={20} /><span>Great pronunciation! 🎉</span></motion.div>}
                {phase === 'fail' && <motion.div className="result-banner retry" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><RotateCcw size={16} /><span>Not quite — listen again!</span></motion.div>}
            </div>
            <style jsx>{`
                .speech-card { padding: 2rem; height: 100%; display: flex; flex-direction: column; overflow-y: auto; }
                .speech-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .loc-tag { display: flex; align-items: center; gap: 0.5rem; color: #D4AF37; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase; }
                .close-btn { background: #f5f5f5; border: none; color: #bbb; cursor: pointer; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .listen-section, .speak-section { margin-bottom: 2rem; }
                .listen-section h3, .speak-section h3 { font-size: 0.75rem; font-weight: 900; color: #D4AF37; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1rem; }
                .play-btn { background: #000; color: white; border: none; padding: 1rem 2rem; border-radius: 20px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.8rem; width: 100%; justify-content: center; margin-bottom: 0.8rem; }
                .reveal-btn { background: none; border: none; color: #999; font-weight: 700; font-size: 0.8rem; cursor: pointer; }
                .script-reveal { background: #fffdf5; border-radius: 16px; padding: 1.2rem; border: 1px solid #FFE58F; overflow: hidden; margin-top: 0.5rem; }
                .script-reveal .kr { font-family: 'Noto Sans KR', sans-serif; font-size: 1.3rem; font-weight: 700; color: #D4AF37; margin-bottom: 0.5rem; }
                .script-reveal .en { font-size: 0.85rem; color: #666; }
                .mic-btn { width: 100%; padding: 1.2rem; border-radius: 20px; border: 2px dashed #eee; background: #fdfcf8; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.8rem; color: #333; }
                .mic-btn.recording { background: #EF4444; color: white; border-color: #EF4444; border-style: solid; animation: pulse-mic 1.5s infinite; }
                .mic-btn.ok { border-color: #22C55E; color: #22C55E; }
                @keyframes pulse-mic { 0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 50% { box-shadow: 0 0 0 12px rgba(239,68,68,0); } }
                .transcript-box { background: #f9f9f9; border-radius: 16px; padding: 1rem; margin-top: 1rem; border: 1px solid #eee; }
                .transcript-box.success { border-color: #22C55E; background: #f0fdf4; }
                .transcript-box.fail { border-color: #EF4444; background: #fef2f2; }
                .transcript-box .label { font-size: 0.6rem; font-weight: 900; color: #aaa; letter-spacing: 2px; }
                .transcript-box p { font-family: 'Noto Sans KR', sans-serif; font-size: 1.1rem; font-weight: 700; color: #000; margin: 0.3rem 0 0; }
                .result-banner { display: flex; align-items: center; gap: 0.8rem; padding: 1rem; border-radius: 16px; margin-top: 1rem; font-weight: 700; font-size: 0.85rem; }
                .result-banner.ok { background: #F0FDFA; color: #0D9488; border: 1px solid #5EEAD4; }
                .result-banner.retry { background: #FFF7ED; color: #EA580C; border: 1px solid #FDBA74; }
            `}</style>
        </div>
    );
};

function calcSimilarity(a, b) { if (!a || !b) return 0; let m = 0; const s = a.length < b.length ? a : b; const l = a.length < b.length ? b : a; for (let i = 0; i < s.length; i++) { if (l.includes(s[i])) m++; } return m / l.length; }


/* ━━━ AI Korean Tutor ━━━ */
const AI_CONVERSATIONS = {
    palace: [
        { role: 'tutor', text: '안녕하세요! 경복궁에 오신 걸 환영합니다. 무엇을 도와드릴까요?', eng: 'Hello! Welcome to Gyeongbokgung. How can I help?' },
        { role: 'suggest', options: ['한복 대여 어디서 해요?', '입장료가 얼마예요?', '안내 지도 있어요?'] },
    ],
    cafe: [
        { role: 'tutor', text: '어서오세요! 무엇을 주문하시겠어요?', eng: 'Welcome! What would you like to order?' },
        { role: 'suggest', options: ['아메리카노 한 잔 주세요', '여기 시그니처 메뉴가 뭐예요?', '화장실이 어디예요?'] },
    ],
    market: [
        { role: 'tutor', text: '광장시장에 왔어요! 뭐 먹어볼래요?', eng: "You're at Gwangjang Market! What to eat?" },
        { role: 'suggest', options: ['이거 하나 주세요', '얼마예요?', '매운 거 빼주세요'] },
    ],
    default: [
        { role: 'tutor', text: '안녕하세요! 저는 여행 한국어 AI 튜터예요. 무엇이든 물어보세요!', eng: "Hi! I'm your Travel Korean AI Tutor." },
        { role: 'suggest', options: ['화장실이 어디예요?', '이 근처 맛집 추천해 주세요', '사진 찍어주실 수 있어요?'] },
    ]
};
const TUTOR_REPLIES = {
    '한복 대여 어디서 해요?': { text: '한복 대여점은 경복궁 동문 앞에 있어요. 한복 입으면 입장 무료예요!', eng: 'Hanbok rental is by the east gate. Free entry with Hanbok!' },
    '입장료가 얼마예요?': { text: '외국인은 3,000원이에요. 한복 입으면 무료입니다!', eng: "3,000 won for foreigners. Free with Hanbok!" },
    '안내 지도 있어요?': { text: '네, 매표소에서 무료 지도를 받을 수 있어요.', eng: 'Yes, free map at the ticket booth.' },
    '아메리카노 한 잔 주세요': { text: '네! 아이스로 드릴까요, 핫으로 드릴까요?', eng: 'Iced or hot?', followUp: ['아이스요', '핫으로 주세요'] },
    '여기 시그니처 메뉴가 뭐예요?': { text: '요즘 인기 있는 건 흑임자 라떼예요!', eng: 'Black Sesame Latte is popular!' },
    '화장실이 어디예요?': { text: '저쪽 왼편에 있어요.', eng: "It's on the left over there." },
    '이거 하나 주세요': { text: '네, 잠시만요! 3,000원입니다.', eng: "One moment! 3,000 won." },
    '얼마예요?': { text: '이거 5,000원이에요!', eng: "5,000 won!" },
    '매운 거 빼주세요': { text: '네, 안 맵게 해드릴게요!', eng: "Not spicy, got it!" },
    '이 근처 맛집 추천해 주세요': { text: '여기서 5분 거리에 유명한 칼국수집 있어요!', eng: "Famous noodle place 5 min away!" },
    '사진 찍어주실 수 있어요?': { text: '물론이죠! 여기서 찍을까요?', eng: 'Of course! Here?' },
    '아이스요': { text: '아이스 아메리카노 나왔습니다. 맛있게 드세요!', eng: 'Here is your iced americano. Enjoy!' },
    '핫으로 주세요': { text: '따뜻한 아메리카노 나왔습니다. 맛있게 드세요!', eng: 'Here is your hot americano. Enjoy!' },
};

const AITutor = ({ spot }) => {
    const key = spot?.type === 'history' ? 'palace' : spot?.type === 'trend' ? 'cafe' : spot?.type === 'foodie' ? 'market' : 'default';
    const [messages, setMessages] = useState(AI_CONVERSATIONS[key] || AI_CONVERSATIONS.default);
    const [inputText, setInputText] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const sendMessage = (text) => {
        const reply = TUTOR_REPLIES[text];
        const bot = reply ? { role: 'tutor', text: reply.text, eng: reply.eng } : { role: 'tutor', text: '좋은 질문이에요! 잘 하고 있어요! 👏', eng: "Great question! You're doing great!" };
        const newMsgs = [...messages, { role: 'user', text }, bot];
        if (reply?.followUp) newMsgs.push({ role: 'suggest', options: reply.followUp });
        setMessages(newMsgs); setInputText('');
    };

    return (
        <div className="tutor-container">
            <div className="tutor-header"><div className="tutor-avatar"><Bot size={24} /></div><div><strong>Korean Travel Tutor</strong><span className="online-dot">● Online</span></div></div>
            <div className="chat-body">
                {messages.map((msg, i) => {
                    if (msg.role === 'tutor') return (
                        <motion.div key={i} className="msg tutor-msg" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                            <p className="kr-text">{msg.text}</p>{msg.eng && <p className="en-text">{msg.eng}</p>}
                            <button className="speak-btn" onClick={() => { const s = new SpeechSynthesisUtterance(msg.text); s.lang = 'ko-KR'; s.rate = 0.8; window.speechSynthesis.speak(s); }}><Volume2 size={12} /></button>
                        </motion.div>
                    );
                    if (msg.role === 'user') return <motion.div key={i} className="msg user-msg" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}><p>{msg.text}</p></motion.div>;
                    if (msg.role === 'suggest') return <div key={i} className="suggest-row">{msg.options.map((o, j) => <button key={j} className="suggest-chip" onClick={() => sendMessage(o)}>{o}</button>)}</div>;
                    return null;
                })}
                <div ref={chatEndRef} />
            </div>
            <div className="chat-input-bar">
                <input value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && inputText.trim()) sendMessage(inputText.trim()); }} placeholder="한국어로 입력하세요..." />
                <button className="send-btn" onClick={() => inputText.trim() && sendMessage(inputText.trim())} disabled={!inputText.trim()}><Send size={18} /></button>
            </div>
            <style jsx>{`
                .tutor-container { display: flex; flex-direction: column; height: 100%; }
                .tutor-header { display: flex; align-items: center; gap: 1rem; padding: 1.5rem 2rem; border-bottom: 1px solid #f0f0f0; }
                .tutor-avatar { width: 44px; height: 44px; background: #000; color: #D4AF37; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .tutor-header strong { display: block; font-size: 1rem; color: #000; }
                .online-dot { color: #22C55E; font-size: 0.7rem; font-weight: 700; margin-left: 0.5rem; }
                .chat-body { flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
                .msg { max-width: 85%; padding: 1rem 1.2rem; border-radius: 20px; position: relative; }
                .tutor-msg { background: #f5f5f5; align-self: flex-start; border-bottom-left-radius: 4px; }
                .tutor-msg .kr-text { font-family: 'Noto Sans KR', sans-serif; font-size: 1.05rem; font-weight: 700; color: #000; margin-bottom: 0.3rem; }
                .tutor-msg .en-text { font-size: 0.75rem; color: #888; }
                .speak-btn { position: absolute; top: 0.6rem; right: 0.6rem; background: none; border: none; color: #ccc; cursor: pointer; }
                .user-msg { background: #000; color: #D4AF37; align-self: flex-end; border-bottom-right-radius: 4px; }
                .user-msg p { font-family: 'Noto Sans KR', sans-serif; font-weight: 700; font-size: 1rem; margin: 0; }
                .suggest-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .suggest-chip { background: #fdfcf8; border: 1px solid #eee; padding: 0.6rem 1rem; border-radius: 50px; font-family: 'Noto Sans KR', sans-serif; font-size: 0.8rem; font-weight: 700; cursor: pointer; color: #333; }
                .suggest-chip:hover { border-color: #D4AF37; color: #D4AF37; }
                .chat-input-bar { display: flex; gap: 0.8rem; padding: 1rem 1.5rem; border-top: 1px solid #f0f0f0; }
                .chat-input-bar input { flex: 1; padding: 0.9rem 1.2rem; border-radius: 50px; border: 2px solid #f0f0f0; font-family: 'Noto Sans KR', sans-serif; font-size: 0.95rem; font-weight: 600; color: #000; background: #fdfcf8; }
                .chat-input-bar input:focus { border-color: #000; outline: none; }
                .send-btn { width: 44px; height: 44px; border-radius: 50%; background: #000; color: #D4AF37; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .send-btn:disabled { opacity: 0.3; }
            `}</style>
        </div>
    );
};

export default ItineraryDetail;
