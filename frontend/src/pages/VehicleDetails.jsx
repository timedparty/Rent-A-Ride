import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then((res) => {
        setVehicle(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Vehicle not found');
        setLoading(false);
      });
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // In Sprint 2, the booking form will be rendered directly here
      alert('Ready to book! Booking form will connect in Sprint 2.');
    }
  };

  if (loading) {
    return <p style={{ color: 'var(--text)' }}>Loading vehicle details...</p>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: '#e53e3e' }}>{error}</p>
        <Link to="/vehicles" style={{ color: 'var(--accent)' }}>← Back to Vehicles</Link>
      </div>
    );
  }

  if (!vehicle) return null;

  const isAvailable = vehicle.status === 'available';

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Link
        to="/vehicles"
        style={{
          display: 'inline-block',
          marginBottom: '1.25rem',
          color: 'var(--text)',
          textDecoration: 'none',
          fontSize: '0.9rem'
        }}
      >
        ← Back to Vehicles
      </Link>

      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: '6px',
          padding: '1.75rem',
          backgroundColor: 'var(--bg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-h)' }}>
            {vehicle.vehicleBrand} {vehicle.vehicleModel}
          </h2>
          <span
            style={{
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0.25rem 0.6rem',
              borderRadius: '4px',
              border: '1px solid var(--border)',
              fontWeight: 500,
              color: isAvailable ? '#2e7d32' : '#c62828',
              backgroundColor: isAvailable ? 'rgba(46, 125, 50, 0.08)' : 'rgba(198, 40, 40, 0.08)'
            }}
          >
            {vehicle.status}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.95rem' }}>
          <p style={{ margin: 0 }}>
            <strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{vehicle.vehicleType}</span>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Registration Number:</strong> {vehicle.registrationNo}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Daily Rental Rate:</strong> ₹{vehicle.dailyRent} / day
          </p>
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          {isAvailable ? (
            <button
              onClick={handleBookNow}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Book Now
            </button>
          ) : (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--code-bg)',
                borderRadius: '4px',
                textAlign: 'center',
                color: 'var(--text)',
                fontSize: '0.9rem'
              }}
            >
              This vehicle is currently unavailable for booking.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
