import { useEffect, useState } from 'react';
import api from '../api/client';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');

  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newVehicle, setNewVehicle] = useState({
    vehicleBrand: '',
    vehicleModel: '',
    vehicleType: 'car',
    registrationNo: '',
    dailyRent: '',
    status: 'available'
  });
  const [vehicleMsg, setVehicleMsg] = useState('');

  const [newBranch, setNewBranch] = useState({
    branchName: '',
    address: '',
    city: '',
    phone: ''
  });
  const [branchMsg, setBranchMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get('/bookings'),
      api.get('/vehicles'),
      api.get('/branches?all=true')
    ])
      .then(([bookingsRes, vehiclesRes, branchesRes]) => {
        setBookings(bookingsRes.data);
        setVehicles(vehiclesRes.data);
        setBranches(branchesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load admin dashboard data');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBookingStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setVehicleMsg('');
    try {
      await api.post('/vehicles', {
        ...newVehicle,
        dailyRent: Number(newVehicle.dailyRent)
      });
      setVehicleMsg('Vehicle added successfully.');
      setNewVehicle({
        vehicleBrand: '',
        vehicleModel: '',
        vehicleType: 'car',
        registrationNo: '',
        dailyRent: '',
        status: 'available'
      });
      loadData();
    } catch (err) {
      setVehicleMsg(err.response?.data?.message || 'Failed to add vehicle');
    }
  };

  const handleVehicleStatusChange = async (id, status) => {
    try {
      await api.patch(`/vehicles/${id}`, { status });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update vehicle');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vehicle');
    }
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    setBranchMsg('');
    try {
      await api.post('/branches', newBranch);
      setBranchMsg('Branch added successfully.');
      setNewBranch({ branchName: '', address: '', city: '', phone: '' });
      loadData();
    } catch (err) {
      setBranchMsg(err.response?.data?.message || 'Failed to add branch');
    }
  };

  const handleToggleBranch = async (id, currentStatus) => {
    try {
      await api.patch(`/branches/${id}`, { isActive: !currentStatus });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update branch');
    }
  };

  const handleDeleteBranch = async (id) => {
    if (!window.confirm('Delete this branch?')) return;
    try {
      await api.delete(`/branches/${id}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete branch');
    }
  };

  const tabStyle = (tab) => ({
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    background: activeTab === tab ? 'var(--accent)' : 'transparent',
    color: activeTab === tab ? '#fff' : 'inherit',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontWeight: 500,
    fontSize: '0.9rem'
  });

  const tableHeaderStyle = {
    padding: '0.6rem',
    borderBottom: '2px solid var(--border)',
    textAlign: 'left',
    fontSize: '0.85rem',
    fontWeight: 600
  };

  const tableCellStyle = {
    padding: '0.6rem',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.85rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.45rem',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    background: 'transparent',
    color: 'inherit',
    boxSizing: 'border-box'
  };

  if (loading) return <p style={{ color: 'var(--text)' }}>Loading admin data...</p>;
  if (error) return <p style={{ color: '#e53e3e' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.25rem', color: 'var(--text-h)' }}>Admin Dashboard</h2>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button type="button" style={tabStyle('bookings')} onClick={() => setActiveTab('bookings')}>
          Bookings ({bookings.length})
        </button>
        <button type="button" style={tabStyle('vehicles')} onClick={() => setActiveTab('vehicles')}>
          Vehicles ({vehicles.length})
        </button>
        <button type="button" style={tabStyle('branches')} onClick={() => setActiveTab('branches')}>
          Branches ({branches.length})
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Customer</th>
                <th style={tableHeaderStyle}>Vehicle</th>
                <th style={tableHeaderStyle}>Dates</th>
                <th style={tableHeaderStyle}>Cost</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ ...tableCellStyle, textAlign: 'center', color: 'var(--text)' }}>
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id}>
                    <td style={tableCellStyle}>
                      {b.customer?.name}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text)' }}>{b.customer?.phone}</div>
                    </td>
                    <td style={tableCellStyle}>
                      {b.vehicle?.vehicleBrand} {b.vehicle?.vehicleModel}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text)' }}>{b.vehicle?.registrationNo}</div>
                    </td>
                    <td style={tableCellStyle}>
                      {new Date(b.pickupDate).toLocaleDateString()} to {new Date(b.returnDate).toLocaleDateString()}
                    </td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>₹{b.totalCost}</td>
                    <td style={tableCellStyle}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid var(--border)',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {b.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleBookingStatus(b._id, 'confirmed')}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBookingStatus(b._id, 'cancelled')}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', color: '#c62828' }}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleBookingStatus(b._id, 'active')}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              Activate (Rented)
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBookingStatus(b._id, 'cancelled')}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', color: '#c62828' }}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status === 'active' && (
                          <button
                            type="button"
                            onClick={() => handleBookingStatus(b._id, 'completed')}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer', color: '#2e7d32' }}
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div>
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '1.25rem',
              backgroundColor: 'var(--bg)',
              marginBottom: '1.5rem'
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--text-h)' }}>Add New Vehicle</h3>
            {vehicleMsg && (
              <p style={{ fontSize: '0.85rem', color: vehicleMsg.includes('success') ? '#2e7d32' : '#e53e3e' }}>
                {vehicleMsg}
              </p>
            )}
            <form onSubmit={handleAddVehicle} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Brand (e.g. Hyundai)"
                required
                value={newVehicle.vehicleBrand}
                onChange={(e) => setNewVehicle({ ...newVehicle, vehicleBrand: e.target.value })}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Model (e.g. i20)"
                required
                value={newVehicle.vehicleModel}
                onChange={(e) => setNewVehicle({ ...newVehicle, vehicleModel: e.target.value })}
                style={inputStyle}
              />
              <select
                value={newVehicle.vehicleType}
                onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value })}
                style={inputStyle}
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
              </select>
              <input
                type="text"
                placeholder="Registration Number"
                required
                value={newVehicle.registrationNo}
                onChange={(e) => setNewVehicle({ ...newVehicle, registrationNo: e.target.value })}
                style={inputStyle}
              />
              <input
                type="number"
                placeholder="Daily Rent (₹)"
                required
                min="0"
                value={newVehicle.dailyRent}
                onChange={(e) => setNewVehicle({ ...newVehicle, dailyRent: e.target.value })}
                style={inputStyle}
              />
              <select
                value={newVehicle.status}
                onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
                style={inputStyle}
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <button
                type="submit"
                style={{
                  gridColumn: '1 / -1',
                  padding: '0.5rem',
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Add Vehicle
              </button>
            </form>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Brand / Model</th>
                  <th style={tableHeaderStyle}>Type</th>
                  <th style={tableHeaderStyle}>Reg No</th>
                  <th style={tableHeaderStyle}>Daily Rent</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v._id}>
                    <td style={tableCellStyle}>{v.vehicleBrand} {v.vehicleModel}</td>
                    <td style={{ ...tableCellStyle, textTransform: 'capitalize' }}>{v.vehicleType}</td>
                    <td style={tableCellStyle}>{v.registrationNo}</td>
                    <td style={tableCellStyle}>₹{v.dailyRent}</td>
                    <td style={tableCellStyle}>
                      <select
                        value={v.status}
                        onChange={(e) => handleVehicleStatusChange(v._id, e.target.value)}
                        style={{ padding: '0.2rem', fontSize: '0.8rem', border: '1px solid var(--border)', background: 'transparent', color: 'inherit' }}
                      >
                        <option value="available">available</option>
                        <option value="rented">rented</option>
                        <option value="unavailable">unavailable</option>
                      </select>
                    </td>
                    <td style={tableCellStyle}>
                      <button
                        type="button"
                        onClick={() => handleDeleteVehicle(v._id)}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: '#c62828', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'branches' && (
        <div>
          <div
            style={{
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '1.25rem',
              backgroundColor: 'var(--bg)',
              marginBottom: '1.5rem'
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--text-h)' }}>Add New Branch</h3>
            {branchMsg && (
              <p style={{ fontSize: '0.85rem', color: branchMsg.includes('success') ? '#2e7d32' : '#e53e3e' }}>
                {branchMsg}
              </p>
            )}
            <form onSubmit={handleAddBranch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <input
                type="text"
                placeholder="Branch Name (e.g. Airport Hub)"
                required
                value={newBranch.branchName}
                onChange={(e) => setNewBranch({ ...newBranch, branchName: e.target.value })}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="City (e.g. Mumbai)"
                required
                value={newBranch.city}
                onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Address"
                required
                value={newBranch.address}
                onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Phone"
                required
                value={newBranch.phone}
                onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                style={inputStyle}
              />
              <button
                type="submit"
                style={{
                  gridColumn: '1 / -1',
                  padding: '0.5rem',
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Add Branch
              </button>
            </form>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>Branch Name</th>
                  <th style={tableHeaderStyle}>City</th>
                  <th style={tableHeaderStyle}>Address</th>
                  <th style={tableHeaderStyle}>Phone</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((b) => (
                  <tr key={b._id}>
                    <td style={tableCellStyle}>{b.branchName}</td>
                    <td style={tableCellStyle}>{b.city}</td>
                    <td style={tableCellStyle}>{b.address}</td>
                    <td style={tableCellStyle}>{b.phone}</td>
                    <td style={tableCellStyle}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: b.isActive ? '#2e7d32' : '#c62828' }}>
                        {b.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={tableCellStyle}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleBranch(b._id, b.isActive)}
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          {b.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBranch(b._id)}
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: '#c62828', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
