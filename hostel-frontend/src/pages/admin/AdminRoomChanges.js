import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, XCircle, X } from 'lucide-react';
import api from '../../services/api';

const AdminRoomChanges = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState('');
    const [adminRemarks, setAdminRemarks] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/room-booking-requests');
            if (response.status === 200) {
                setRequests(response.data);
                setFilteredRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setMessage('Error fetching room change requests');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = requests.filter(req => 
            req.studentName.toLowerCase().includes(term) ||
            req.roomNumber.toLowerCase().includes(term) ||
            req.status.toLowerCase().includes(term)
        );
        setFilteredRequests(filtered);
    };

    const handleUpdateStatus = async () => {
        setIsProcessing(true);
        try {
            await api.put(`/admin/room-booking-requests/${selectedRequest.id}?status=${statusUpdate}&adminRemarks=${encodeURIComponent(adminRemarks)}`);
            setMessage('Request updated successfully');
            setShowUpdateModal(false);
            setAdminRemarks('');
            fetchRequests();
        } catch (error) {
            setMessage('Error updating request');
        } finally {
            setIsProcessing(false);
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
                <h1 className="text-2xl font-bold text-gray-800">Room Change Requests</h1>
                <button 
                    onClick={fetchRequests}
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
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search requests..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Student</th>
                                <th className="px-4 py-3">Requested Room</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{req.studentName}</td>
                                        <td className="px-4 py-3">Room {req.roomNumber}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                                req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {req.status === 'PENDING' && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedRequest(req);
                                                        setStatusUpdate('APPROVED');
                                                        setShowUpdateModal(true);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                >
                                                    Review
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                        No room change requests found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Review Request</h3>
                            <button onClick={() => setShowUpdateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                <p><span className="font-semibold">Student:</span> {selectedRequest.studentName}</p>
                                <p><span className="font-semibold">Room:</span> {selectedRequest.roomNumber}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
                                <select 
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={statusUpdate}
                                    onChange={(e) => setStatusUpdate(e.target.value)}
                                >
                                    <option value="APPROVED">Approve</option>
                                    <option value="REJECTED">Reject</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                <textarea
                                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                                    placeholder="Add any remarks..."
                                    value={adminRemarks}
                                    onChange={(e) => setAdminRemarks(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowUpdateModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={isProcessing}
                                    className={`flex-1 px-4 py-2 text-white rounded-lg font-medium disabled:opacity-50 ${
                                        statusUpdate === 'APPROVED' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {isProcessing ? 'Processing...' : 'Confirm Decision'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRoomChanges;