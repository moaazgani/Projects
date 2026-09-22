import { Link, NavLink } from 'react-router-dom';
import '../css/Navbar.css'

function Navbar() {
    return <div className="navbar">
        <div className='navbar-brand'>
            <Link to="/">Movie App</Link>
        </div>
        <nav className='navbar-links' aria-label="Main navigation">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
            <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Favorites</NavLink>
        </nav>
    </div>
}

export default Navbar