import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [roomForm, setRoomForm] = useState({ roomNumber: '', capacity: '' });
    const [editingRoom, setEditingRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showAllocateModal, setShowAllocateModal] = useState(false);
    const [showDeallocateModal, setShowDeallocateModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [roomSearchTerm, setRoomSearchTerm] = useState('');
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [roomBookingRequests, setRoomBookingRequests] = useState([]);
    const [filteredRoomBookingRequests, setFilteredRoomBookingRequests] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [filteredMaintenanceRequests, setFilteredMaintenanceRequests] = useState([]);
    const [roomBookingSearchTerm, setRoomBookingSearchTerm] = useState('');
    const [maintenanceSearchTerm, setMaintenanceSearchTerm] = useState('');
    const [showUpdateBookingModal, setShowUpdateBookingModal] = useState(false);
    const [showUpdateMaintenanceModal, setShowUpdateMaintenanceModal] = useState(false);
    const [selectedBookingRequest, setSelectedBookingRequest] = useState(null);
    const [selectedMaintenanceRequest, setSelectedMaintenanceRequest] = useState(null);
    const [bookingStatusUpdate, setBookingStatusUpdate] = useState('');
    const [maintenanceStatusUpdate, setMaintenanceStatusUpdate] = useState('');
    const [adminRemarks, setAdminRemarks] = useState('');

    // Search functions
    const handleRoomSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setRoomSearchTerm(searchTerm);
        
        if (searchTerm === '') {
            setFilteredRooms(rooms);
        } else {
            const filtered = rooms.filter(room => 
                room.roomNumber.toLowerCase().includes(searchTerm) ||
                room.id.toString().includes(searchTerm) ||
                room.capacity.toString().includes(searchTerm)
            );
            setFilteredRooms(filtered);
        }
    };

    const handleStudentSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setStudentSearchTerm(searchTerm);
        
        if (searchTerm === '') {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(student => 
                student.user?.name.toLowerCase().includes(searchTerm) ||
                student.user?.email.toLowerCase().includes(searchTerm) ||
                student.id.toString().includes(searchTerm) ||
                student.room?.roomNumber.toLowerCase().includes(searchTerm)
            );
            setFilteredStudents(filtered);
        }
    };

    const handleRoomBookingSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setRoomBookingSearchTerm(searchTerm);
        
        if (searchTerm === '') {
            setFilteredRoomBookingRequests(roomBookingRequests);
        } else {
            const filtered = roomBookingRequests.filter(request => 
                request.id.toString().includes(searchTerm) ||
                request.studentName.toLowerCase().includes(searchTerm) ||
                request.roomNumber.toLowerCase().includes(searchTerm) ||
                request.status.toLowerCase().includes(searchTerm)
            );
            setFilteredRoomBookingRequests(filtered);
        }
    };

    const handleMaintenanceSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setMaintenanceSearchTerm(searchTerm);
        
        if (searchTerm === '') {
            setFilteredMaintenanceRequests(maintenanceRequests);
        } else {
            const filtered = maintenanceRequests.filter(request => 
                request.id.toString().includes(searchTerm) ||
                request.studentName.toLowerCase().includes(searchTerm) ||
                request.roomNumber.toLowerCase().includes(searchTerm) ||
                request.status.toLowerCase().includes(searchTerm) ||
                request.description.toLowerCase().includes(searchTerm)
            );
            setFilteredMaintenanceRequests(filtered);
        }
    };

    // New deallocation functions
    const openDeallocateModal = (roomId) => {
        setSelectedRoomId(roomId);
        setShowDeallocateModal(true);
    };

    const closeDeallocateModal = () => {
        setShowDeallocateModal(false);
        setSelectedRoomId(null);
        setSelectedStudentId('');
    };

    const confirmDeallocateStudent = async () => {
        if (selectedStudentId) {
            try {
                const response = await api.put(`/admin/rooms/${selectedRoomId}/deallocate-student/${selectedStudentId}`);
                
                if (response.status === 200) {
                    setMessage('Student deallocated successfully');
                    fetchData(); // Refresh data
                    closeDeallocateModal();
                } else {
                    setMessage('Error deallocating student');
                }
            } catch (error) {
                console.error('Deallocation error:', error);
                if (error.response) {
                    setMessage(`Error: ${error.response.data}`);
                } else {
                    setMessage(`Error: ${error.message}`);
                }
            }
        }
    };

    // Fetch all data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roomsRes, studentsRes, bookingRequestsRes, maintenanceRequestsRes] = await Promise.all([
                api.get('/admin/rooms'),
                api.get('/admin/students'),
                api.get('/admin/room-booking-requests'),
                api.get('/admin/maintenance-requests')
            ]);

            if (roomsRes.status === 200) {
                setRooms(roomsRes.data);
                setFilteredRooms(roomsRes.data);
                console.log('Rooms fetched:', roomsRes.data);
            }
            if (studentsRes.status === 200) {
                setStudents(studentsRes.data);
                setFilteredStudents(studentsRes.data);
                console.log('Students fetched:', studentsRes.data);
            }
            if (bookingRequestsRes.status === 200) {
                setRoomBookingRequests(bookingRequestsRes.data);
                setFilteredRoomBookingRequests(bookingRequestsRes.data);
            }
            if (maintenanceRequestsRes.status === 200) {
                setMaintenanceRequests(maintenanceRequestsRes.data);
                setFilteredMaintenanceRequests(maintenanceRequestsRes.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    // Update the refresh button to also refresh booking and maintenance requests
    const handleRefresh = () => {
        setMessage('');
        fetchData();
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!roomForm.roomNumber.trim()) {
            setMessage('Error: Room number is required');
            return;
        }
        
        const capacity = parseInt(roomForm.capacity);
        if (isNaN(capacity) || capacity <= 0) {
            setMessage('Error: Capacity must be a positive number');
            return;
        }
        
        try {
            const response = await api.post('/admin/rooms', {
                roomNumber: roomForm.roomNumber.trim(),
                capacity: capacity
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
                setMessage(`Error: ${error.response.data || error.response.statusText}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    const handleUpdateRoom = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!roomForm.roomNumber.trim()) {
            setMessage('Error: Room number is required');
            return;
        }
        
        const capacity = parseInt(roomForm.capacity);
        if (isNaN(capacity) || capacity <= 0) {
            setMessage('Error: Capacity must be a positive number');
            return;
        }
        
        try {
            const response = await api.put(`/admin/rooms/${editingRoom.id}`, {
                roomNumber: roomForm.roomNumber.trim(),
                capacity: capacity
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
                setMessage(`Error: ${error.response.data || error.response.statusText}`);
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
            console.log('Allocating room:', roomId, 'to student:', studentId);
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
            console.error('Allocation error:', error);
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

    // Room Booking Request Functions
    const openUpdateBookingModal = (request) => {
        setSelectedBookingRequest(request);
        setBookingStatusUpdate(request.status);
        setAdminRemarks(request.adminRemarks || '');
        setShowUpdateBookingModal(true);
    };

    const closeUpdateBookingModal = () => {
        setShowUpdateBookingModal(false);
        setSelectedBookingRequest(null);
        setBookingStatusUpdate('');
        setAdminRemarks('');
    };

    const handleUpdateBookingRequest = async () => {
        if (!selectedBookingRequest) return;
        
        try {
            const response = await api.put(`/admin/room-booking-requests/${selectedBookingRequest.id}?status=${bookingStatusUpdate}&adminRemarks=${encodeURIComponent(adminRemarks)}`);
            
            if (response.status === 200) {
                setMessage('Room booking request updated successfully!');
                fetchData(); // Refresh all data
                closeUpdateBookingModal();
            } else {
                setMessage('Error updating room booking request');
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data || error.response.statusText}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    // Maintenance Request Functions
    const openUpdateMaintenanceModal = (request) => {
        setSelectedMaintenanceRequest(request);
        setMaintenanceStatusUpdate(request.status);
        setAdminRemarks(request.adminRemarks || '');
        setShowUpdateMaintenanceModal(true);
    };

    const closeUpdateMaintenanceModal = () => {
        setShowUpdateMaintenanceModal(false);
        setSelectedMaintenanceRequest(null);
        setMaintenanceStatusUpdate('');
        setAdminRemarks('');
    };

    const handleUpdateMaintenanceRequest = async () => {
        if (!selectedMaintenanceRequest) return;
        
        try {
            const response = await api.put(`/admin/maintenance-requests/${selectedMaintenanceRequest.id}`, {
                ...selectedMaintenanceRequest,
                status: maintenanceStatusUpdate,
                adminRemarks: adminRemarks
            });
            
            if (response.status === 200) {
                setMessage('Maintenance request updated successfully!');
                fetchData(); // Refresh all data
                closeUpdateMaintenanceModal();
            } else {
                setMessage('Error updating maintenance request');
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data || error.response.statusText}`);
            } else {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    // Calculate statistics
    const totalRooms = Array.isArray(rooms) ? rooms.length : 0;
    const occupiedRooms = Array.isArray(rooms) ? rooms.filter(room => room && room.occupied).length : 0;
    const availableRooms = totalRooms - occupiedRooms;
    const totalStudents = Array.isArray(students) ? students.length : 0;
    const studentsWithRooms = Array.isArray(students) ? students.filter(student => student && student.room).length : 0;
    const studentsWithoutRooms = totalStudents - studentsWithRooms;
    const pendingBookingRequests = Array.isArray(roomBookingRequests) ? roomBookingRequests.filter(req => req.status === 'PENDING').length : 0;
    const pendingMaintenanceRequests = Array.isArray(maintenanceRequests) ? maintenanceRequests.filter(req => req.status === 'PENDING').length : 0;
    // eslint-disable-next-line no-unused-vars
    const studentsWithoutRoomsCount = studentsWithoutRooms;

    if (loading) {
        return <div className="dashboard">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <nav className="navbar">
                <div className="navbar-title">Admin Dashboard</div>
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
                    <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
                        {message}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">{totalRooms}</div>
                        <div className="stat-label">Total Rooms</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{occupiedRooms}</div>
                        <div className="stat-label">Occupied Rooms</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{availableRooms}</div>
                        <div className="stat-label">Available Rooms</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{totalStudents}</div>
                        <div className="stat-label">Total Students</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{pendingBookingRequests}</div>
                        <div className="stat-label">Pending Bookings</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{pendingMaintenanceRequests}</div>
                        <div className="stat-label">Pending Maintenance</div>
                    </div>
                </div>

                <div className="section-title">Room Management</div>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', alignItems: 'center' }}>
                    <button 
                        className="btn" 
                        onClick={() => {
                            setEditingRoom(null);
                            setRoomForm({ roomNumber: '', capacity: '' });
                            setShowRoomForm(true);
                        }}
                    >
                        ➕ Add New Room
                    </button>
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={roomSearchTerm}
                        onChange={handleRoomSearch}
                        className="search-input"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
                    />
                </div>

                {showRoomForm && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">
                                    {editingRoom ? '✏️ Edit Room' : '➕ Add New Room'}
                                </h3>
                                <button className="close-btn" onClick={cancelEdit}>×</button>
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
                            <th>Status</th>
                            <th>Occupant</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRooms && Array.isArray(filteredRooms) ?
                            filteredRooms.length > 0 ?
                                filteredRooms.map(room => (
                                    <tr key={room.id}>
                                        <td>{room.id}</td>
                                        <td>{room.roomNumber}</td>
                                        <td>{room.capacity}</td>
                                        <td>
                                            <span className={`status-indicator ${room.occupied ? 'status-active' : 'status-inactive'}`}>
                                                {room.occupied ? 'Occupied' : 'Available'}
                                            </span>
                                        </td>
                                        <td>{room.students && room.students.length > 0 ? `${room.students[0].user?.name} (${room.students[0].user?.email})` : 'None'}</td>
                                        <td>
                                            <button 
                                                className="btn-action btn-edit"
                                                onClick={() => startEditRoom(room)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button 
                                                className="btn-action btn-delete"
                                                onClick={() => handleDeleteRoom(room.id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                            {!room.occupied && (
                                                <button 
                                                    className="btn-action btn-allocate"
                                                    onClick={() => openAllocateModal(room.id)}
                                                >
                                                    🏠 Allocate
                                                </button>
                                            )}
                                            {room.occupied && (
                                                <button 
                                                    className="btn-action btn-deallocate"
                                                    onClick={() => openDeallocateModal(room.id)}
                                                >
                                                    🚶 Deallocate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            : 
                                <tr>
                                    <td colSpan="6">No rooms found</td>
                                </tr>
                        : 
                            <tr>
                                <td colSpan="6">Loading rooms...</td>
                            </tr>
                        }
                    </tbody>
                </table>

                {/* Allocate Room Modal */}
                {showAllocateModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">🏠 Allocate Room</h3>
                                <button className="close-btn" onClick={closeAllocateModal}>×</button>
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
                                            .filter(student => student && !student.room) // Only students without rooms
                                            .map(student => (
                                                <option key={student.id} value={student.id}>
                                                    {student.user?.name} ({student.user?.email})
                                                </option>
                                            ))
                                    : <option value="">No students available</option>}
                                </select>
                            </div>
                            <button 
                                className="btn" 
                                onClick={confirmAllocateRoom}
                                disabled={!selectedStudentId}
                            >
                                🏠 Allocate Room
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Deallocate Student from Room Modal */}
                {showDeallocateModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">🚶 Deallocate Student</h3>
                                <button className="close-btn" onClick={closeDeallocateModal}>×</button>
                            </div>
                            <div className="form-group">
                                <label>Select Student to Deallocate</label>
                                <select
                                    value={selectedStudentId}
                                    onChange={(e) => setSelectedStudentId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a student</option>
                                    {rooms && Array.isArray(rooms) && 
                                        rooms.find(room => room.id === selectedRoomId)?.students
                                            ?.map(student => (
                                                <option key={student.id} value={student.id}>
                                                    {student.user?.name} ({student.user?.email})
                                                </option>
                                            ))}
                                </select>
                            </div>
                            <button 
                                className="btn" 
                                onClick={confirmDeallocateStudent}
                                disabled={!selectedStudentId}
                            >
                                🚶 Deallocate Student
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="section-title" style={{ marginTop: '40px' }}>Student Management</div>
                
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={studentSearchTerm}
                        onChange={handleStudentSearch}
                        className="search-input"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                    />
                </div>
                
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Room</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents && Array.isArray(filteredStudents) ?
                            filteredStudents.length > 0 ?
                                filteredStudents.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.id}</td>
                                        <td>{student.user?.name}</td>
                                        <td>{student.user?.email}</td>
                                        <td>{student.room ? `${student.room.roomNumber}` : 'No Room'}</td>
                                        <td>
                                            <span className={`status-indicator ${student.room ? 'status-active' : 'status-inactive'}`}>
                                                {student.room ? 'Assigned' : 'No Room'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn-action btn-delete"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this student?')) {
                                                        // Implement delete student functionality
                                                    }
                                                }}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            : 
                                <tr>
                                    <td colSpan="6">No students found</td>
                                </tr>
                        : 
                            <tr>
                                <td colSpan="6">No students found</td>
                            </tr>
                        }
                    </tbody>
                </table>
                
                {/* Room Booking Requests Section */}
                <div className="section-title" style={{ marginTop: '40px' }}>Room Booking Requests</div>
                
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search booking requests..."
                        value={roomBookingSearchTerm}
                        onChange={handleRoomBookingSearch}
                        className="search-input"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                    />
                </div>
                
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>Room</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Admin Remarks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRoomBookingRequests && Array.isArray(filteredRoomBookingRequests) ?
                            filteredRoomBookingRequests.length > 0 ?
                                filteredRoomBookingRequests.map(request => (
                                    <tr key={request.id}>
                                        <td>{request.id}</td>
                                        <td>{request.studentName} ({request.studentEmail})</td>
                                        <td>{request.roomNumber}</td>
                                        <td>{request.roomCapacity}</td>
                                        <td>
                                            <span className={`status-indicator ${request.status === 'PENDING' ? 'status-inactive' : request.status === 'APPROVED' ? 'status-active' : 'status-active'}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>{request.adminRemarks || 'None'}</td>
                                        <td>
                                            <button 
                                                className="btn-action btn-edit"
                                                onClick={() => openUpdateBookingModal(request)}
                                            >
                                                ✏️ Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            : 
                                <tr>
                                    <td colSpan="8">No room booking requests found</td>
                                </tr>
                        : 
                            <tr>
                                <td colSpan="8">No room booking requests found</td>
                            </tr>
                        }
                    </tbody>
                </table>
                
                {/* Maintenance Requests Section */}
                <div className="section-title" style={{ marginTop: '40px' }}>Maintenance Requests</div>
                
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search maintenance requests..."
                        value={maintenanceSearchTerm}
                        onChange={handleMaintenanceSearch}
                        className="search-input"
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                    />
                </div>
                
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Student</th>
                            <th>Room</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Admin Remarks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMaintenanceRequests && Array.isArray(filteredMaintenanceRequests) ?
                            filteredMaintenanceRequests.length > 0 ?
                                filteredMaintenanceRequests.map(request => (
                                    <tr key={request.id}>
                                        <td>{request.id}</td>
                                        <td>{request.studentName}</td>
                                        <td>{request.roomNumber}</td>
                                        <td>{request.description}</td>
                                        <td>
                                            <span className={`status-indicator ${request.status === 'PENDING' ? 'status-inactive' : request.status === 'IN_PROGRESS' ? 'status-active' : 'status-active'}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td>{request.adminRemarks || 'None'}</td>
                                        <td>
                                            <button 
                                                className="btn-action btn-edit"
                                                onClick={() => openUpdateMaintenanceModal(request)}
                                            >
                                                ✏️ Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            : 
                                <tr>
                                    <td colSpan="8">No maintenance requests found</td>
                                </tr>
                        : 
                            <tr>
                                <td colSpan="8">No maintenance requests found</td>
                            </tr>
                        }
                    </tbody>
                </table>
                
                {/* Admin Tips */}
                <div className="card" style={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3' }}>
                    <h3 className="card-title">💡 Admin Tips</h3>
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                        <li>Monitor room occupancy to ensure efficient allocation</li>
                        <li>Regularly update student records to maintain accuracy</li>
                        <li>Keep track of available rooms for incoming students</li>
                        <li>Use the statistics to identify trends and plan accordingly</li>
                    </ul>
                </div>
                
                {/* Update Room Booking Request Modal */}
                {showUpdateBookingModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">🏠 Update Room Booking Request</h3>
                                <button className="close-btn" onClick={closeUpdateBookingModal}>×</button>
                            </div>
                            <div className="form-group">
                                <label>Request ID: {selectedBookingRequest?.id}</label>
                                <p><strong>Student:</strong> {selectedBookingRequest?.studentName}</p>
                                <p><strong>Room:</strong> {selectedBookingRequest?.roomNumber}</p>
                                <p><strong>Current Status:</strong> {selectedBookingRequest?.status}</p>
                                <label htmlFor="bookingStatus">New Status</label>
                                <select
                                    id="bookingStatus"
                                    value={bookingStatusUpdate}
                                    onChange={(e) => setBookingStatusUpdate(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="REJECTED">REJECTED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                                <label htmlFor="adminRemarks">Admin Remarks</label>
                                <textarea
                                    id="adminRemarks"
                                    value={adminRemarks}
                                    onChange={(e) => setAdminRemarks(e.target.value)}
                                    rows="3"
                                    placeholder="Add remarks for the student..."
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '8px' }}
                                />
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button 
                                    className="btn-secondary"
                                    onClick={closeUpdateBookingModal}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn"
                                    onClick={handleUpdateBookingRequest}
                                >
                                    Update Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Update Maintenance Request Modal */}
                {showUpdateMaintenanceModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">🔧 Update Maintenance Request</h3>
                                <button className="close-btn" onClick={closeUpdateMaintenanceModal}>×</button>
                            </div>
                            <div className="form-group">
                                <label>Request ID: {selectedMaintenanceRequest?.id}</label>
                                <p><strong>Student:</strong> {selectedMaintenanceRequest?.studentName}</p>
                                <p><strong>Room:</strong> {selectedMaintenanceRequest?.roomNumber}</p>
                                <p><strong>Description:</strong> {selectedMaintenanceRequest?.description}</p>
                                <p><strong>Current Status:</strong> {selectedMaintenanceRequest?.status}</p>
                                <label htmlFor="maintenanceStatus">New Status</label>
                                <select
                                    id="maintenanceStatus"
                                    value={maintenanceStatusUpdate}
                                    onChange={(e) => setMaintenanceStatusUpdate(e.target.value)}
                                    className="form-control"
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                                <label htmlFor="adminRemarks">Admin Remarks</label>
                                <textarea
                                    id="adminRemarks"
                                    value={adminRemarks}
                                    onChange={(e) => setAdminRemarks(e.target.value)}
                                    rows="3"
                                    placeholder="Add remarks for the student..."
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '8px' }}
                                />
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button 
                                    className="btn-secondary"
                                    onClick={closeUpdateMaintenanceModal}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn"
                                    onClick={handleUpdateMaintenanceRequest}
                                >
                                    Update Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;