import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ maxWidth: '720px', margin: '2rem auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-h)' }}>
        Rent-A-Ride
      </h1>
      <p style={{ fontSize: '1.15rem', color: 'var(--text)', lineHeight: 1.6, marginBottom: '2rem' }}>
        A simple and reliable vehicle rental platform. Browse available cars and bikes, book with instant availability checks, and manage your rentals with ease.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link
          to="/vehicles"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--accent)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 600
          }}
        >
          Browse Vehicles
        </Link>
        <Link
          to="/register"
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid var(--border)',
            color: 'var(--text-h)',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 500
          }}
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Home;
