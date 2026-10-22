import { useEffect, useState } from 'react';
import api from '../api/client';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingBookingId, setPayingBookingId] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = () => {
    api.get('/bookings/my-bookings')
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load bookings');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setActionLoading(true);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePay = async (bookingId) => {
    setActionLoading(true);
    try {
      await api.post(`/payments/${bookingId}`, { paymentMethod: selectedMethod });
      setPayingBookingId(null);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment recording failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--text)' }}>Loading your bookings...</p>;

  if (error) return <p style={{ color: '#e53e3e' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-h)' }}>My Bookings</h2>

      {bookings.length === 0 ? (
        <p style={{ color: 'var(--text)' }}>You have no bookings yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {bookings.map((b) => (
            <div
              key={b._id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '1.5rem',
                backgroundColor: 'var(--bg)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-h)' }}>
                  {b.vehicle?.vehicleBrand} {b.vehicle?.vehicleModel}
                </h3>
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border)',
                    fontWeight: 600,
                    backgroundColor:
                      b.status === 'confirmed' || b.status === 'completed'
                        ? 'rgba(46, 125, 50, 0.1)'
                        : b.status === 'cancelled'
                        ? 'rgba(198, 40, 40, 0.1)'
                        : 'rgba(255, 193, 7, 0.15)',
                    color:
                      b.status === 'confirmed' || b.status === 'completed'
                        ? '#2e7d32'
                        : b.status === 'cancelled'
                        ? '#c62828'
                        : '#b78103'
                  }}
                >
                  {b.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text)' }}>
                <p style={{ margin: 0 }}>
                  <strong>Reg No:</strong> {b.vehicle?.registrationNo}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Dates:</strong> {new Date(b.pickupDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Pickup:</strong> {b.pickupBranch?.branchName} ({b.pickupBranch?.city})
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Dropoff:</strong> {b.dropoffBranch?.branchName} ({b.dropoffBranch?.city})
                </p>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-h)' }}>
                  <strong>Total:</strong> ₹{b.totalCost} ({b.totalDays} {b.totalDays === 1 ? 'day' : 'days'})
                </p>
              </div>

              {payingBookingId === b._id && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: 'var(--code-bg)',
                    borderRadius: '4px',
                    border: '1px solid var(--border)'
                  }}
                >
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, fontSize: '0.9rem' }}>
                    Choose Demo Payment Method:
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                    {['upi', 'card', 'cash'].map((m) => (
                      <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                        <input
                          type="radio"
                          name={`method-${b._id}`}
                          value={m}
                          checked={selectedMethod === m}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handlePay(b._id)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        backgroundColor: '#2e7d32',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    >
                      {actionLoading ? 'Processing...' : `Pay ₹${b.totalCost} (Demo)`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayingBookingId(null)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        background: 'none',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: 'var(--text)'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                {b.status === 'pending' && payingBookingId !== b._id && (
                  <button
                    type="button"
                    onClick={() => {
                      setPayingBookingId(b._id);
                      setSelectedMethod('upi');
                    }}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#2e7d32',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}
                  >
                    Demo Payment
                  </button>
                )}

                {['pending', 'confirmed'].includes(b.status) && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleCancel(b._id)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: 'none',
                      border: '1px solid #c62828',
                      color: '#c62828',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
