import { useEffect, useState } from 'react';
import api from '../api/client';
import VehicleCard from '../components/VehicleCard';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/vehicles')
      .then((res) => {
        setVehicles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load vehicles');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ color: 'var(--text)' }}>Loading vehicles...</p>;
  }

  if (error) {
    return <p style={{ color: '#e53e3e' }}>{error}</p>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-h)' }}>Vehicles</h2>
      {vehicles.length === 0 ? (
        <p style={{ color: 'var(--text)' }}>No vehicles found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Vehicles;
