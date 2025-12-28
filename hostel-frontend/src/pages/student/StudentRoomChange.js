import React, { useState, useEffect } from 'react';
import { Home, RefreshCw, X, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const StudentRoomChange = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [allRooms, setAllRooms] = useState([]);
    const [roomBookingRequests, setRoomBookingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const profileRes = await api.get('/student/profile');
            if (profileRes.status === 200) {
                setStudentInfo(profileRes.data);
                
                const [roomsRes, bookingsRes] = await Promise.all([
                    api.get('/student/rooms'),
                    api.get(`/student/room-booking-requests?studentId=${profileRes.data.id}`)
                ]);

                if (roomsRes.status === 200) {
                    setAllRooms(roomsRes.data.filter(r => r.students?.length < r.capacity));
                }
                if (bookingsRes.status === 200) {
                    setRoomBookingRequests(bookingsRes.data);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('Error fetching room change data');
        } finally {
            setLoading(false);
        }
    };

    const handleBookRoom = async (roomId) => {
        try {
            await api.post(`/student/room-booking-requests?studentId=${studentInfo.id}&roomId=${roomId}`);
            setMessage('Room change request submitted successfully');
            setShowBookingModal(false);
            fetchData();
        } catch (error) {
            setMessage('Error submitting room change request');
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
                <h1 className="text-2xl font-bold text-gray-800">Room Change Request</h1>
                <button onClick={fetchData} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center justify-between ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    <span>{message}</span>
                    <button onClick={() => setMessage('')} className="hover:opacity-70">×</button>
                </div>
            )}

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Available Rooms</h3>
                        <div className="bg-indigo-50 px-3 py-1 rounded-full">
                            <span className="text-xs font-bold text-indigo-600">{allRooms.length} rooms available</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allRooms.map(room => (
                            <div key={room.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                        <Home className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                        {room.capacity - (room.students?.length || 0)} slots left
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-900">Room {room.roomNumber}</h4>
                                <p className="text-sm text-gray-500 mb-4">Capacity: {room.capacity} students</p>
                                <button 
                                    onClick={() => {
                                        setSelectedRoom(room);
                                        setShowBookingModal(true);
                                    }}
                                    disabled={studentInfo?.room?.id === room.id}
                                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                                        studentInfo?.room?.id === room.id
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                                >
                                    {studentInfo?.room?.id === room.id ? 'Current Room' : 'Request Change'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Request History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">Room</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Admin Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {roomBookingRequests.length > 0 ? (
                                    roomBookingRequests.map(req => (
                                        <tr key={req.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">Room {req.roomNumber}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                                    req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {req.adminRemarks || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No request history found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Booking Confirmation Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Confirm Request</h3>
                            <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-indigo-50 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-indigo-700">
                                    You are requesting a room change to <strong>Room {selectedRoom?.roomNumber}</strong>. 
                                    This request will be reviewed by the administrator.
                                </p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleBookRoom(selectedRoom.id)}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentRoomChange;