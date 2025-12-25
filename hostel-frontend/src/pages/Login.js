import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const result = await login(email, password);
        if (result.success) {
            // Navigate to the appropriate dashboard based on role
            if (result.role === 'ADMIN') {
                navigate('/admin');
            } else if (result.role === 'STUDENT') {
                navigate('/student');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Hostel Management System</h2>
            <h3 className="form-title">Login</h3>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" className="btn">Login</button>
            </form>
            
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
        </div>
    );
};

export default Login;