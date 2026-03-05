import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import KJourneyHome from './pages/KJourneyHome';
import TransportDetail from './pages/TransportDetail';
import DestinationsDetail from './pages/DestinationsDetail';
import CultureDetail from './pages/CultureDetail';
import ItineraryDetail from './pages/ItineraryDetail';
import KoreanLessonsDetail from './pages/KoreanLessonsDetail';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<KJourneyHome />} />
                    <Route path="/transport" element={<TransportDetail />} />
                    <Route path="/destinations" element={<DestinationsDetail />} />
                    <Route path="/culture" element={<CultureDetail />} />
                    <Route path="/itinerary" element={<ItineraryDetail />} />
                    <Route path="/lessons" element={<KoreanLessonsDetail />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
