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
    const [allRooms, setAllRooms] = useState([]);
    const [showRoomBookingModal, setShowRoomBookingModal] = useState(false);
    const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [maintenanceForm, setMaintenanceForm] = useState({ description: '' });
    const [roomBookingRequests, setRoomBookingRequests] = useState([]);

    useEffect(() => {
        fetchStudentProfile();
        fetchAllRooms();
        if (studentInfo) {
            fetchMaintenanceRequests(studentInfo.id);
            fetchRoomBookingRequests(studentInfo.id);
        }
        
        // Set up auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchStudentProfile();
            fetchAllRooms();
            if (studentInfo) {
                fetchMaintenanceRequests(studentInfo.id);
                fetchRoomBookingRequests(studentInfo.id);
            }
        }, 30000);
        
        return () => clearInterval(interval);
    }, [studentInfo]);

    const fetchStudentProfile = async () => {
        try {
            const response = await api.get('/student/profile');
            
            if (response.status === 200) {
                setStudentInfo(response.data);
                setLastUpdated(new Date().toLocaleTimeString());
                setMessage('');
            } else {
                setMessage('Error fetching student profile');
                setStudentInfo(null);
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data || error.response.statusText}`);
            } else if (error.request) {
                setMessage('Network error: Unable to connect to the server');
            } else {
                setMessage(`Error: ${error.message}`);
            }
            setStudentInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setMessage('');
        fetchStudentProfile();
    };

    const fetchAllRooms = async () => {
        try {
            const response = await api.get('/admin/rooms');
            
            if (response.status === 200) {
                // Filter out rooms that are already full
                const availableRooms = response.data.filter(room => {
                    return room.students && room.students.length < room.capacity;
                });
                setAllRooms(availableRooms);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleBookRoom = async (roomId) => {
        if (!studentInfo) return;
        
        try {
            const response = await api.post(`/student/room-booking-requests?studentId=${studentInfo.id}&roomId=${roomId}`);
            
            if (response.status === 200) {
                setMessage('Room booking request submitted successfully! Admin will review your request.');
                setShowRoomBookingModal(false);
                setSelectedRoomForBooking(null);
                fetchRoomBookingRequests(studentInfo.id); // Refresh the list
            } else {
                setMessage('Error submitting room booking request');
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data || error.response.statusText}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    const fetchMaintenanceRequests = async (studentId) => {
        try {
            const response = await api.get(`/student/maintenance-requests?studentId=${studentId}`);
            
            if (response.status === 200) {
                setMaintenanceRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching maintenance requests:', error);
        }
    };

    const fetchRoomBookingRequests = async (studentId) => {
        try {
            const response = await api.get(`/student/room-booking-requests?studentId=${studentId}`);
            
            if (response.status === 200) {
                setRoomBookingRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching room booking requests:', error);
        }
    };

    const handleCreateMaintenanceRequest = async (e) => {
        e.preventDefault();
        
        if (!studentInfo || !maintenanceForm.description.trim()) return;
        
        try {
            const response = await api.post('/student/maintenance-requests', {
                studentId: studentInfo.id,
                roomId: studentInfo.room?.id || null,  // Use null if no room assigned
                description: maintenanceForm.description.trim(),
                status: 'PENDING'
            });
            
            if (response.status === 200) {
                setMessage('Maintenance request submitted successfully!');
                setMaintenanceForm({ description: '' });
                setShowMaintenanceModal(false);
                fetchMaintenanceRequests(studentInfo.id); // Refresh the list
            } else {
                setMessage('Error submitting maintenance request');
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data || error.response.statusText}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    const openRoomBookingModal = (room) => {
        setSelectedRoomForBooking(room);
        setShowRoomBookingModal(true);
    };

    const closeRoomBookingModal = () => {
        setShowRoomBookingModal(false);
        setSelectedRoomForBooking(null);
    };

    if (loading) {
        return <div className="dashboard">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <nav className="navbar">
                <div className="navbar-title">Student Dashboard</div>
                <div className="navbar-actions">
                    <div className="navbar-user">
                        Welcome, {user?.email}
                    </div>
                    <button className="logout-btn" onClick={async () => {
                        await logout();
                        navigate('/login');
                    }}>Logout</button>
                </div>
            </nav>

            <div className="content">
                {message && (
                    <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-info'}`}>
                        {message}
                    </div>
                )}

                <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="section-title">Your Profile</div>
                    <button className="btn-secondary" onClick={handleRefresh} style={{ padding: '10px 18px', fontSize: '14px' }}>
                        🔄 Refresh
                    </button>
                </div>
                
                {studentInfo ? (
                    <div className="card">
                        <h3 className="card-title">🎓 Student Information</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            <div>
                                <p><strong>👤 Name:</strong> {studentInfo.user?.name}</p>
                                <p><strong>📧 Email:</strong> {studentInfo.user?.email}</p>
                                <p><strong>🏷️ Role:</strong> {studentInfo.user?.role}</p>
                            </div>
                            
                            {studentInfo.room ? (
                                <div>
                                    <h4>🏠 Your Room</h4>
                                    <p><strong>🔢 Room Number:</strong> {studentInfo.room.roomNumber}</p>
                                    <p><strong>Capacity:</strong> {studentInfo.room.capacity}</p>
                                    <p><strong>✅ Status:</strong> Occupied</p>
                                    <p><strong>👥 Occupants:</strong> 
                                        {studentInfo.room.student ? ` ${studentInfo.room.student.user?.name}` : 'None'}
                                    </p>
                                </div>
                            ) : (
                                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
                                    <h4>🏠 Room Status</h4>
                                    <p style={{ color: '#856404' }}>You are not assigned to a room yet.</p>
                                    <p style={{ color: '#856404' }}>Please contact the admin for room allocation.</p>
                                </div>
                            )}
                        </div>
                        
                        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666', textAlign: 'right' }}>
                            Last updated: {lastUpdated}
                        </div>
                    </div>
                ) : (
                    <div className="card">
                        <h3 className="card-title">❓ Profile Status</h3>
                        <p>No student profile found. Please contact the admin.</p>
                    </div>
                )}
                
                {/* Hostel Information Section */}
                <div className="card">
                    <h3 className="card-title">🏫 Hostel Information</h3>
                    <p>As a student, you have access to:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
                        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <h4>🏠 Room Details</h4>
                            <p>View your assigned room information and capacity</p>
                        </div>
                        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <h4>🔄 Real-time Updates</h4>
                            <p>Your profile updates automatically every 30 seconds</p>
                        </div>
                        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <h4>📞 Admin Support</h4>
                            <p>Contact admin for room allocation or issues</p>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                        <p><strong>💡 Tip:</strong> Use the refresh button to get the latest information about your room assignment!</p>
                    </div>
                </div>
                
                {/* Available Rooms for Booking */}
                {!studentInfo?.room && (
                    <div className="card">
                        <h3 className="card-title">🏠 Available Rooms for Booking</h3>
                        {allRooms && allRooms.length > 0 ? (
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Room Number</th>
                                            <th>Capacity</th>
                                            <th>Available Slots</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allRooms.map(room => {
                                            const availableSlots = room.capacity - (room.students?.length || 0);
                                            return (
                                                <tr key={room.id}>
                                                    <td>{room.id}</td>
                                                    <td>{room.roomNumber}</td>
                                                    <td>{room.capacity}</td>
                                                    <td>{availableSlots}</td>
                                                    <td>
                                                        <button 
                                                            className="btn-action btn-allocate"
                                                            onClick={() => openRoomBookingModal(room)}
                                                        >
                                                            📝 Request Room
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No rooms are currently available for booking.</p>
                        )}
                    </div>
                )}
                
                {/* Maintenance Requests Section */}
                <div className="card">
                    <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="card-title">🔧 Maintenance Requests</h3>
                        <button className="btn" onClick={() => setShowMaintenanceModal(true)} style={{ padding: '8px 16px', fontSize: '14px' }}>
                            ➕ New Request
                        </button>
                    </div>
                    
                    {maintenanceRequests && maintenanceRequests.length > 0 ? (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Room</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {maintenanceRequests.map(request => (
                                        <tr key={request.id}>
                                            <td>{request.id}</td>
                                            <td>{request.roomNumber}</td>
                                            <td>{request.description}</td>
                                            <td>
                                                <span className={`status-indicator ${request.status === 'PENDING' ? 'status-inactive' : request.status === 'IN_PROGRESS' ? 'status-active' : 'status-active'}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No maintenance requests submitted yet.</p>
                    )}
                </div>
                
                {/* Room Booking Requests Section */}
                <div className="card">
                    <h3 className="card-title">🏠 Your Room Booking Requests</h3>
                    
                    {roomBookingRequests && roomBookingRequests.length > 0 ? (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Room</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Admin Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roomBookingRequests.map(request => (
                                        <tr key={request.id}>
                                            <td>{request.id}</td>
                                            <td>{request.roomNumber}</td>
                                            <td>
                                                <span className={`status-indicator ${request.status === 'PENDING' ? 'status-inactive' : request.status === 'APPROVED' ? 'status-active' : 'status-active'}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</td>
                                            <td>{request.adminRemarks || 'None'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No room booking requests submitted yet.</p>
                    )}
                </div>
                
                {/* Motivational Section */}
                <div className="card" style={{ backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50' }}>
                    <h3 className="card-title">🌟 Motivation</h3>
                    <p style={{ fontSize: '18px', fontStyle: 'italic', color: '#2e7d32' }}>
                        "Success is the sum of small efforts repeated day in and day out." - Robert Collier
                    </p>
                    <p style={{ marginTop: '10px' }}>
                        Make the most of your hostel experience. Focus on your studies and create lasting friendships!
                    </p>
                </div>
                
                {/* Room Booking Modal */}
                {showRoomBookingModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">🏠 Request Room Booking</h3>
                                <button className="close-btn" onClick={closeRoomBookingModal}>×</button>
                            </div>
                            <div>
                                <p><strong>Room Number:</strong> {selectedRoomForBooking?.roomNumber}</p>
                                <p><strong>Capacity:</strong> {selectedRoomForBooking?.capacity}</p>
                                <p><strong>Available Slots:</strong> {selectedRoomForBooking ? selectedRoomForBooking.capacity - (selectedRoomForBooking.students?.length || 0) : 0}</p>
                                <p>Do you want to request this room?</p>
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button 
                                    className="btn-secondary"
                                    onClick={closeRoomBookingModal}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn"
                                    onClick={() => handleBookRoom(selectedRoomForBooking?.id)}
                                >
                                    Confirm Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Maintenance Request Modal */}
                {showMaintenanceModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">🔧 Submit Maintenance Request</h3>
                                <button className="close-btn" onClick={() => {
                                    setShowMaintenanceModal(false);
                                    setMaintenanceForm({ description: '' });
                                }}>×</button>
                            </div>
                            <form onSubmit={handleCreateMaintenanceRequest}>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={maintenanceForm.description}
                                        onChange={(e) => setMaintenanceForm({...maintenanceForm, description: e.target.value})}
                                        required
                                        rows="4"
                                        placeholder="Describe the maintenance issue..."
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button 
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => {
                                            setShowMaintenanceModal(false);
                                            setMaintenanceForm({ description: '' });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="btn"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;