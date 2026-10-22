import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '1.5rem', padding: '1rem 2rem', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
      <Link to="/">Home</Link>
      <Link to="/vehicles">Vehicles</Link>
      {isAuthenticated ? (
        <>
          <Link to="/my-bookings">My Bookings</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
          <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: 'var(--text)' }}>
            {user?.name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              padding: '0.3rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer',
              color: 'var(--text-h)'
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.5rem' }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
