import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupBranch, setPickupBranch] = useState('');
  const [dropoffBranch, setDropoffBranch] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get(`/vehicles/${id}`),
      api.get('/branches')
    ])
      .then(([vehicleRes, branchRes]) => {
        setVehicle(vehicleRes.data);
        setBranches(branchRes.data);
        if (branchRes.data.length > 0) {
          setPickupBranch(branchRes.data[0]._id);
          setDropoffBranch(branchRes.data[0]._id);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load details');
        setLoading(false);
      });
  }, [id]);

  const calculateDaysAndCost = () => {
    if (!pickupDate || !returnDate || !vehicle) return null;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return null;
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return { days, cost: days * vehicle.dailyRent };
  };

  const preview = calculateDaysAndCost();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBookingError('');
    setBookingLoading(true);
    try {
      const res = await api.post('/bookings', {
        vehicle: id,
        pickupBranch,
        dropoffBranch,
        pickupDate,
        returnDate,
        licenseNo,
        licenseExpiry
      });
      setBookingSuccess(res.data.booking);
    } catch (err) {
      if (err.response?.status === 409) {
        setBookingError('This vehicle is already booked for the selected dates. Please choose different dates.');
      } else {
        setBookingError(err.response?.data?.message || 'Failed to create booking.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDemoPayment = async () => {
    if (!bookingSuccess) return;
    setPaymentError('');
    setPaymentLoading(true);
    try {
      await api.post(`/payments/${bookingSuccess._id}`, { paymentMethod });
      navigate('/my-bookings');
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Payment recording failed.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const fieldStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    background: 'transparent',
    color: 'inherit',
    boxSizing: 'border-box'
  };

  if (loading) return <p style={{ color: 'var(--text)' }}>Loading vehicle details...</p>;

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
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <Link
        to="/vehicles"
        style={{ display: 'inline-block', marginBottom: '1.25rem', color: 'var(--text)', textDecoration: 'none', fontSize: '0.9rem' }}
      >
        ← Back to Vehicles
      </Link>

      <div style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1.75rem', backgroundColor: 'var(--bg)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-h)' }}>
            {vehicle.vehicleBrand} {vehicle.vehicleModel}
          </h2>
          <span style={{
            fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px',
            padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)', fontWeight: 500,
            color: isAvailable ? '#2e7d32' : '#c62828',
            backgroundColor: isAvailable ? 'rgba(46, 125, 50, 0.08)' : 'rgba(198, 40, 40, 0.08)'
          }}>
            {vehicle.status}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
          <p style={{ margin: 0 }}><strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{vehicle.vehicleType}</span></p>
          <p style={{ margin: 0 }}><strong>Registration:</strong> {vehicle.registrationNo}</p>
          <p style={{ margin: 0 }}><strong>Rate:</strong> ₹{vehicle.dailyRent} / day</p>
        </div>
      </div>

      {isAvailable ? (
        <div style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '1.75rem', backgroundColor: 'var(--bg)' }}>
          {!bookingSuccess ? (
            <>
              <h3 style={{ marginTop: 0, color: 'var(--text-h)' }}>Book this Vehicle</h3>
              {bookingError && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(229, 62, 62, 0.1)', border: '1px solid #e53e3e', borderRadius: '4px', color: '#e53e3e', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {bookingError}
                </div>
              )}
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Pickup Date</label>
                    <input type="date" required value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} style={fieldStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Return Date</label>
                    <input type="date" required value={returnDate} onChange={(e) => setReturnDate(e.target.value)} style={fieldStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Pickup Branch</label>
                    <select value={pickupBranch} onChange={(e) => setPickupBranch(e.target.value)} required style={{ ...fieldStyle, background: 'var(--bg)' }}>
                      {branches.map((b) => (
                        <option key={b._id} value={b._id}>{b.branchName} ({b.city})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Drop-off Branch</label>
                    <select value={dropoffBranch} onChange={(e) => setDropoffBranch(e.target.value)} required style={{ ...fieldStyle, background: 'var(--bg)' }}>
                      {branches.map((b) => (
                        <option key={b._id} value={b._id}>{b.branchName} ({b.city})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Driver's License Number *</label>
                    <input type="text" required value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} style={fieldStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>License Expiry Date *</label>
                    <input type="date" required value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} style={fieldStyle} />
                  </div>
                </div>

                {preview && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--code-bg)', borderRadius: '4px', fontSize: '0.9rem' }}>
                    <p style={{ margin: '0 0 0.25rem 0' }}><strong>Estimated Duration:</strong> {preview.days} {preview.days === 1 ? 'day' : 'days'}</p>
                    <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-h)' }}><strong>Estimated Total Cost:</strong> ₹{preview.cost}</p>
                  </div>
                )}

                <button type="submit" disabled={bookingLoading} style={{ padding: '0.75rem', backgroundColor: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 600, cursor: bookingLoading ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}>
                  {bookingLoading ? 'Checking availability...' : 'Confirm Booking'}
                </button>
              </form>
            </>
          ) : (
            <div>
              <div style={{ padding: '1rem', backgroundColor: 'rgba(46, 125, 50, 0.1)', border: '1px solid #2e7d32', borderRadius: '4px', color: '#2e7d32', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Booking Created (Status: Pending)</h4>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Total Cost: ₹{bookingSuccess.totalCost} for {bookingSuccess.totalDays} days.</p>
              </div>

              <h4 style={{ marginTop: 0, color: 'var(--text-h)' }}>Complete Demo Payment</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                This is a demo payment system for project demonstration. No real money will be charged.
              </p>

              {paymentError && <p style={{ color: '#e53e3e', fontSize: '0.9rem' }}>{paymentError}</p>}

              <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
                {['upi', 'card', 'cash'].map((method) => (
                  <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.85rem' }}>
                    <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} />
                    {method}
                  </label>
                ))}
              </div>

              <button type="button" onClick={handleDemoPayment} disabled={paymentLoading} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 600, cursor: paymentLoading ? 'not-allowed' : 'pointer' }}>
                {paymentLoading ? 'Processing...' : `Pay ₹${bookingSuccess.totalCost} (Demo Payment)`}
              </button>

              <button type="button" onClick={() => navigate('/my-bookings')} style={{ width: '100%', padding: '0.6rem', background: 'none', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.9rem', cursor: 'pointer', marginTop: '0.75rem', color: 'var(--text)' }}>
                Pay Later (Go to My Bookings)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '1rem', backgroundColor: 'var(--code-bg)', borderRadius: '4px', textAlign: 'center', color: 'var(--text)', fontSize: '0.95rem' }}>
          This vehicle is currently unavailable for booking.
        </div>
      )}
    </div>
  );
}

export default VehicleDetails;
