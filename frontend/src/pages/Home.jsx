import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ maxWidth: '850px', margin: '2.5rem auto', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'var(--accent-bg)', border: '1px solid var(--accent-border)', marginBottom: '1.25rem' }}>
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      </div>

      <h1 style={{ fontSize: '2.4rem', margin: '0 0 0.75rem 0', color: 'var(--text-h)' }}>
        Welcome to Rent-A-Ride
      </h1>

      {isAuthenticated && user && (
        <p style={{ fontSize: '1.05rem', color: 'var(--accent)', fontWeight: 500, margin: '0 0 0.5rem 0' }}>
          Hello, {user.name}!
        </p>
      )}


      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
        <Link
          to="/vehicles"
          style={{
            padding: '0.7rem 1.5rem',
            backgroundColor: 'var(--accent)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}
        >
          Browse Vehicles
        </Link>
        {isAuthenticated ? (
          <Link
            to="/my-bookings"
            style={{
              padding: '0.7rem 1.5rem',
              border: '1px solid var(--border)',
              color: 'var(--text-h)',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          >
            My Bookings
          </Link>
        ) : (
          <Link
            to="/register"
            style={{
              padding: '0.7rem 1.5rem',
              border: '1px solid var(--border)',
              color: 'var(--text-h)',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          >
            Create Account
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
