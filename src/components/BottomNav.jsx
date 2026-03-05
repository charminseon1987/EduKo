import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Courses', icon: 'school', path: '/' },
        { label: 'Learning', icon: 'play_circle', path: '/learning-plans' },
        { label: 'Profile', icon: 'person', path: '/profile' },
    ];

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-container">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className={`material-symbols-outlined ${location.pathname === item.path ? 'fill-1' : ''}`}>
                            {item.icon}
                        </span>
                        <p className="nav-label">{item.label}</p>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
