import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [roomForm, setRoomForm] = useState({ roomNumber: '', capacity: '' });
    const [editingRoom, setEditingRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showAllocateModal, setShowAllocateModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState('');

    // Fetch all data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roomsRes, studentsRes] = await Promise.all([
                api.get('/admin/rooms'),
                api.get('/admin/students')
            ]);

            if (roomsRes.status === 200) {
                setRooms(roomsRes.data);
            }
            if (studentsRes.status === 200) {
                setStudents(studentsRes.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/rooms', {
                roomNumber: roomForm.roomNumber,
                capacity: parseInt(roomForm.capacity)
            });

            if (response.status === 200) {
                setMessage('Room created successfully');
                setRoomForm({ roomNumber: '', capacity: '' });
                setShowRoomForm(false);
                fetchData(); // Refresh data
            } else {
                setMessage(`Error: ${response.data}`);
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    const handleUpdateRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/admin/rooms/${editingRoom.id}`, {
                roomNumber: roomForm.roomNumber,
                capacity: parseInt(roomForm.capacity)
            });

            if (response.status === 200) {
                setMessage('Room updated successfully');
                setRoomForm({ roomNumber: '', capacity: '' });
                setEditingRoom(null);
                fetchData(); // Refresh data
            } else {
                setMessage(`Error: ${response.data}`);
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    const handleDeleteRoom = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                const response = await api.delete(`/admin/rooms/${id}`);

                if (response.status === 204) {
                    setMessage('Room deleted successfully');
                    fetchData(); // Refresh data
                } else {
                    setMessage('Error deleting room');
                }
            } catch (error) {
                if (error.response) {
                    setMessage(`Error: ${error.response.data}`);
                } else {
                    setMessage(`Error: ${error.message}`);
                }
            }
        }
    };

    const handleAllocateRoom = async (roomId, studentId) => {
        try {
            const response = await api.put(`/admin/rooms/${roomId}/allocate/${studentId}`);

            if (response.status === 200) {
                setMessage('Room allocated successfully');
                fetchData(); // Refresh data
                setShowAllocateModal(false);
                setSelectedRoomId(null);
                setSelectedStudentId('');
            } else {
                setMessage('Error allocating room');
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    const handleDeallocateRoom = async (roomId) => {
        try {
            const response = await api.put(`/admin/rooms/${roomId}/deallocate`);

            if (response.status === 200) {
                setMessage('Room deallocated successfully');
                fetchData(); // Refresh data
            } else {
                setMessage('Error deallocating room');
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    const startEditRoom = (room) => {
        setEditingRoom(room);
        setRoomForm({
            roomNumber: room.roomNumber,
            capacity: room.capacity
        });
        setShowRoomForm(true);
    };

    const cancelEdit = () => {
        setEditingRoom(null);
        setRoomForm({ roomNumber: '', capacity: '' });
        setShowRoomForm(false);
    };

    const openAllocateModal = (roomId) => {
        setSelectedRoomId(roomId);
        setShowAllocateModal(true);
    };

    const closeAllocateModal = () => {
        setShowAllocateModal(false);
        setSelectedRoomId(null);
        setSelectedStudentId('');
    };

    const confirmAllocateRoom = () => {
        if (selectedStudentId) {
            handleAllocateRoom(selectedRoomId, selectedStudentId);
        }
    };

    if (loading) {
        return <div className="dashboard">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <nav className="navbar">
                <div className="navbar-title">Admin Dashboard</div>
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

                <div className="section-title">Room Management</div>
                
                <button 
                    className="btn" 
                    onClick={() => {
                        setEditingRoom(null);
                        setRoomForm({ roomNumber: '', capacity: '' });
                        setShowRoomForm(true);
                    }}
                    style={{ marginBottom: '20px' }}
                >
                    Add New Room
                </button>

                {showRoomForm && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">
                                    {editingRoom ? 'Edit Room' : 'Add New Room'}
                                </h3>
                                <button className="close-btn" onClick={cancelEdit}>&times;</button>
                            </div>
                            <form onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom}>
                                <div className="form-group">
                                    <label>Room Number</label>
                                    <input
                                        type="text"
                                        value={roomForm.roomNumber}
                                        onChange={(e) => setRoomForm({...roomForm, roomNumber: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Capacity</label>
                                    <input
                                        type="number"
                                        value={roomForm.capacity}
                                        onChange={(e) => setRoomForm({...roomForm, capacity: e.target.value})}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn">
                                    {editingRoom ? 'Update Room' : 'Create Room'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Room Number</th>
                            <th>Capacity</th>
                            <th>Occupied</th>
                            <th>Student</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map(room => (
                            <tr key={room.id}>
                                <td>{room.id}</td>
                                <td>{room.roomNumber}</td>
                                <td>{room.capacity}</td>
                                <td>{room.occupied ? 'Yes' : 'No'}</td>
                                <td>{room.student ? `${room.student.user?.name} (${room.student.user?.email})` : 'None'}</td>
                                <td>
                                    <button 
                                        className="btn-action btn-edit"
                                        onClick={() => startEditRoom(room)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn-action btn-delete"
                                        onClick={() => handleDeleteRoom(room.id)}
                                    >
                                        Delete
                                    </button>
                                    {!room.occupied && (
                                        <button 
                                            className="btn-action btn-allocate"
                                            onClick={() => openAllocateModal(room.id)}
                                        >
                                            Allocate
                                        </button>
                                    )}
                                    {room.occupied && (
                                        <button 
                                            className="btn-action btn-deallocate"
                                            onClick={() => handleDeallocateRoom(room.id)}
                                        >
                                            Deallocate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Allocate Room Modal */}
                {showAllocateModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Allocate Room</h3>
                                <button className="close-btn" onClick={closeAllocateModal}>&times;</button>
                            </div>
                            <div className="form-group">
                                <label>Select Student</label>
                                <select
                                    value={selectedStudentId}
                                    onChange={(e) => setSelectedStudentId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a student</option>
                                    {students && Array.isArray(students) ? 
                                        students
                                            .filter(student => student && student.room === null) // Only students without rooms
                                            .map(student => (
                                                <option key={student.id} value={student.id}>
                                                    {student.user?.name} ({student.user?.email})
                                                </option>
                                            ))
                                    : null}
                                </select>
                            </div>
                            <button 
                                className="btn" 
                                onClick={confirmAllocateRoom}
                                disabled={!selectedStudentId}
                            >
                                Allocate Room
                            </button>
                        </div>
                    </div>
                )}

                <div className="section-title" style={{ marginTop: '40px' }}>Student Management</div>
                
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Room</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students && Array.isArray(students) ?
                            students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.user?.name}</td>
                                    <td>{student.user?.email}</td>
                                    <td>{student.room ? `${student.room.roomNumber}` : 'None'}</td>
                                    <td>
                                        <button 
                                            className="btn-action btn-delete"
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this student?')) {
                                                    // Implement delete student functionality
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        : 
                            <tr>
                                <td colSpan="5">Loading students...</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;