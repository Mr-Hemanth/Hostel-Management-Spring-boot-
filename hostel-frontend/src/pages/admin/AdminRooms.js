import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users, 
  XCircle, 
  User, 
  X,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [roomForm, setRoomForm] = useState({ roomNumber: '', capacity: '' });
    const [editingRoom, setEditingRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showAllocateModal, setShowAllocateModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [roomSearchTerm, setRoomSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [roomsRes, studentsRes] = await Promise.all([
                api.get('/admin/rooms'),
                api.get('/admin/students')
            ]);

            if (roomsRes.status === 200) {
                setRooms(roomsRes.data);
                setFilteredRooms(roomsRes.data);
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

    const handleRoomSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setRoomSearchTerm(searchTerm);
        const filtered = rooms.filter(room => 
            room.roomNumber.toLowerCase().includes(searchTerm) ||
            room.capacity.toString().includes(searchTerm)
        );
        setFilteredRooms(filtered);
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const response = await api.post('/admin/rooms', roomForm);
            if (response.status === 200) {
                setMessage('Room created successfully');
                setShowRoomForm(false);
                setRoomForm({ roomNumber: '', capacity: '' });
                fetchData();
            }
        } catch (error) {
            setMessage('Error creating room');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateRoom = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            const response = await api.put(`/admin/rooms/${editingRoom.id}`, roomForm);
            if (response.status === 200) {
                setMessage('Room updated successfully');
                setShowRoomForm(false);
                setEditingRoom(null);
                setRoomForm({ roomNumber: '', capacity: '' });
                fetchData();
            }
        } catch (error) {
            setMessage('Error updating room');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteRoom = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            setIsProcessing(true);
            try {
                await api.delete(`/admin/rooms/${id}`);
                setMessage('Room deleted successfully');
                fetchData();
            } catch (error) {
                setMessage('Error deleting room');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleAllocateRoom = async () => {
        if (!selectedStudentId) {
            setMessage('Please select a student');
            return;
        }
        setIsProcessing(true);
        try {
            await api.put(`/admin/rooms/${selectedRoomId}/allocate/${selectedStudentId}`);
            setMessage('Student allocated to room successfully');
            setShowAllocateModal(false);
            setSelectedStudentId('');
            fetchData();
        } catch (error) {
            setMessage('Error allocating room');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeallocateRoom = async (roomId) => {
        if (window.confirm('Are you sure you want to deallocate all students from this room?')) {
            setIsProcessing(true);
            try {
                await api.put(`/admin/rooms/${roomId}/deallocate`);
                setMessage('Room deallocated successfully');
                fetchData();
            } catch (error) {
                setMessage('Error deallocating room');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleDeallocateStudent = async (roomId, studentId) => {
        if (window.confirm('Are you sure you want to remove this student from the room?')) {
            setIsProcessing(true);
            try {
                await api.put(`/admin/rooms/${roomId}/deallocate-student/${studentId}`);
                setMessage('Student removed from room');
                fetchData();
            } catch (error) {
                setMessage('Error removing student');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
                <button 
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center justify-between ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    <span>{message}</span>
                    <button onClick={() => setMessage('')}><XCircle className="w-5 h-5" /></button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search rooms..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                            value={roomSearchTerm}
                            onChange={handleRoomSearch}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingRoom(null);
                            setRoomForm({ roomNumber: '', capacity: '' });
                            setShowRoomForm(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        <Plus className="w-5 h-5" /> Add Room
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Room #</th>
                                <th className="px-4 py-3">Capacity</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredRooms.map((room) => (
                                <React.Fragment key={room.id}>
                                    <tr className="hover:bg-gray-50 border-t">
                                        <td className="px-4 py-3">
                                            <div className="font-medium">{room.roomNumber}</div>
                                            {room.students && room.students.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {room.students.length} student(s) assigned
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">{room.capacity}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                room.occupied ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {room.occupied ? 'Occupied' : 'Available'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {!room.occupied && (
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedRoomId(room.id);
                                                            setShowAllocateModal(true);
                                                        }}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Allocate Student"
                                                    >
                                                        <Users className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {room.students && room.students.length > 0 && (
                                                    <button 
                                                        onClick={() => handleDeallocateRoom(room.id)}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Deallocate All"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => {
                                                        setEditingRoom(room);
                                                        setRoomForm({ roomNumber: room.roomNumber, capacity: room.capacity });
                                                        setShowRoomForm(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteRoom(room.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {room.students && room.students.length > 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-2 bg-gray-50/50">
                                                <div className="flex flex-wrap gap-2">
                                                    {room.students.map((studentSummary) => (
                                                        <div key={studentSummary.id} className="flex items-center gap-2 bg-white px-3 py-1 border rounded-full text-xs shadow-sm">
                                                            <User className="w-3 h-3 text-gray-400" />
                                                            <span className="text-gray-700 font-medium">{studentSummary.user?.name}</span>
                                                            <button 
                                                                onClick={() => handleDeallocateStudent(room.id, studentSummary.id)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                                                                title="Remove student"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Room Form Modal */}
            {showRoomForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                            <button onClick={() => setShowRoomForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={editingRoom ? handleUpdateRoom : handleCreateRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={roomForm.roomNumber}
                                    onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={roomForm.capacity}
                                    onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowRoomForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                                >
                                    {isProcessing ? 'Saving...' : editingRoom ? 'Update Room' : 'Create Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Allocate Modal */}
            {showAllocateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Allocate Student</h3>
                            <button onClick={() => setShowAllocateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                                <select 
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={selectedStudentId}
                                    onChange={(e) => setSelectedStudentId(e.target.value)}
                                >
                                    <option value="">Choose a student...</option>
                                    {students
                                        .filter(s => !s.room)
                                        .map(student => (
                                            <option key={student.id} value={student.id}>
                                                {student.user?.name} ({student.user?.email})
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowAllocateModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAllocateRoom}
                                    disabled={isProcessing || !selectedStudentId}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                                >
                                    {isProcessing ? 'Allocating...' : 'Confirm Allocation'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRooms;