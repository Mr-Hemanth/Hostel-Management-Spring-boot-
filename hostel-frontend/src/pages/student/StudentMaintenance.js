import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, X, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const StudentMaintenance = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ description: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const profileRes = await api.get('/student/profile');
            if (profileRes.status === 200) {
                setStudentInfo(profileRes.data);
                const response = await api.get(`/student/maintenance-requests?studentId=${profileRes.data.id}`);
                if (response.status === 200) {
                    setRequests(response.data);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessage('Error fetching maintenance data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await api.post('/student/maintenance-requests', {
                studentId: studentInfo.id,
                roomId: studentInfo.room?.id || null,
                description: form.description,
                status: 'PENDING'
            });
            setMessage('Maintenance request submitted successfully');
            setShowModal(false);
            setForm({ description: '' });
            fetchData();
        } catch (error) {
            setMessage('Error submitting maintenance request');
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
                <h1 className="text-2xl font-bold text-gray-800">Maintenance Requests</h1>
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

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Your Requests</h3>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> New Request
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Admin Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {requests.length > 0 ? (
                                requests.map(req => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm truncate max-w-[300px]">{req.description}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                req.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                                req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
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
                                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No maintenance requests found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Request Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">New Maintenance Request</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="p-4 bg-amber-50 rounded-xl flex items-start gap-3 mb-4">
                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-700">
                                    Please describe the issue clearly. Our team will look into it as soon as possible.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
                                <textarea
                                    required
                                    className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                                    placeholder="Describe the problem..."
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessing || !form.description.trim()}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                                >
                                    {isProcessing ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentMaintenance;