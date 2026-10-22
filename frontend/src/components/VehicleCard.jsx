import { Link } from 'react-router-dom';

function VehicleCard({ vehicle }) {
  const isAvailable = vehicle.status === 'available';

  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-h)' }}>
            {vehicle.vehicleBrand} {vehicle.vehicleModel}
          </h3>
          <span
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0.2rem 0.5rem',
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

        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'var(--text)' }}>
          <strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{vehicle.vehicleType}</span>
        </p>
        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'var(--text)' }}>
          <strong>Reg No:</strong> {vehicle.registrationNo}
        </p>
        <p style={{ margin: '0.75rem 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-h)' }}>
          ₹{vehicle.dailyRent} <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text)' }}>/ day</span>
        </p>
      </div>

      <div style={{ marginTop: '1.25rem' }}>
        <Link
          to={`/vehicles/${vehicle._id}`}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '0.5rem 1rem',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            textDecoration: 'none',
            color: 'var(--text-h)',
            backgroundColor: 'var(--code-bg)',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default VehicleCard;
