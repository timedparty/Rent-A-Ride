import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    licenseNo: '',
    licenseExpiry: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    background: 'transparent',
    color: 'inherit',
    boxSizing: 'border-box',
    marginTop: '0.2rem'
  };

  return (
    <div style={{ maxWidth: '420px', margin: '2rem auto' }}>
      <h2>Register</h2>
      {error && <p style={{ color: '#e53e3e', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div>
          <label style={{ fontSize: '0.9rem' }}>Full Name *</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.9rem' }}>Email *</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.9rem' }}>Password *</label>
          <input type="password" name="password" required value={formData.password} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.9rem' }}>Phone *</label>
          <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.9rem' }}>Driver's License Number</label>
          <input type="text" name="licenseNo" value={formData.licenseNo} onChange={handleChange} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '0.9rem' }}>License Expiry Date</label>
          <input type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} style={inputStyle} />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.6rem',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: 'var(--accent)',
            color: '#fff',
            fontWeight: 'bold',
            marginTop: '0.5rem'
          }}
        >
          {loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text)' }}>
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
