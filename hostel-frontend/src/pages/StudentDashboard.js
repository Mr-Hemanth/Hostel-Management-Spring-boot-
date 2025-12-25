import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        fetchStudentProfile();
        
        // Set up auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchStudentProfile();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const fetchStudentProfile = async () => {
        try {
            const response = await api.get('/student/profile');
            
            if (response.status === 200) {
                setStudentInfo(response.data);
                setLastUpdated(new Date().toLocaleTimeString());
            } else {
                setMessage('Error fetching student profile');
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setMessage('');
        fetchStudentProfile();
    };

    if (loading) {
        return <div className="dashboard">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <nav className="navbar">
                <div className="navbar-title">Student Dashboard</div>
                <div className="navbar-actions">
                    <span>Welcome, {user?.email}</span>
                    <button className="logout-btn" onClick={async () => {
                        await logout();
                        navigate('/login');
                    }}>Logout</button>
                </div>
            </nav>

            <div className="content">
                {message && (
                    <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
                        {message}
                    </div>
                )}

                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="section-title">Your Profile</div>
                    <button className="btn-secondary" onClick={handleRefresh} style={{ padding: '8px 15px', fontSize: '14px' }}>
                        Refresh
                    </button>
                </div>
                
                {studentInfo ? (
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3>Student Information</h3>
                        <p><strong>Name:</strong> {studentInfo.user?.name}</p>
                        <p><strong>Email:</strong> {studentInfo.user?.email}</p>
                        <p><strong>Role:</strong> {studentInfo.user?.role}</p>
                        
                        {studentInfo.room ? (
                            <div style={{ marginTop: '20px' }}>
                                <h3>Your Room</h3>
                                <p><strong>Room Number:</strong> {studentInfo.room.roomNumber}</p>
                                <p><strong>Capacity:</strong> {studentInfo.room.capacity}</p>
                                <p><strong>Status:</strong> Occupied</p>
                                <p><strong>Occupants:</strong> 
                                    {studentInfo.room.student ? ` ${studentInfo.room.student.user?.name}` : 'None'}
                                </p>
                            </div>
                        ) : (
                            <div style={{ marginTop: '20px' }}>
                                <h3>Room Status</h3>
                                <p>You are not assigned to a room yet. Please contact the admin for room allocation.</p>
                            </div>
                        )}
                        
                        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                            Last updated: {lastUpdated}
                        </div>
                    </div>
                ) : (
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <p>No student profile found. Please contact the admin.</p>
                    </div>
                )}
                
                {/* Hostel Information Section */}
                <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Hostel Information</h3>
                    <p>As a student, you have access to:</p>
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                        <li>View your assigned room details</li>
                        <li>Check your current room status</li>
                        <li>Contact admin for room allocation</li>
                        <li>View your profile information</li>
                    </ul>
                    
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <p><strong>Need Help?</strong> Contact the admin if you need room allocation or have any issues.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;