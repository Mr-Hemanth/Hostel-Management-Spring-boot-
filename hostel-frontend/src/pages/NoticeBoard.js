import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  X,
  Megaphone
} from 'lucide-react';

const NoticeBoard = () => {
    const { user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: '', content: '' });

    const fetchNotices = useCallback(async () => {
        try {
            const response = await api.get('/notices');
            console.log('Notices fetched:', response.data);
            setNotices(response.data || []);
        } catch (error) {
            console.error('Fetch notices error details:', error.response || error);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message;
            setMessage('Error fetching notices: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    const handleCreateNotice = async (e) => {
        e.preventDefault();
        if (!newNotice.title.trim() || !newNotice.content.trim()) {
            setMessage('Error: Title and content are required');
            return;
        }

        try {
            console.log('Creating notice:', newNotice);
            const response = await api.post('/notices', newNotice);
            if (response.status === 200 || response.status === 201) {
                setMessage('Notice posted successfully');
                setShowForm(false);
                setNewNotice({ title: '', content: '' });
                fetchNotices();
            }
        } catch (error) {
            console.error('Create notice error details:', error.response || error);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message;
            setMessage('Error creating notice: ' + errorMsg);
        }
    };

    const handleDeleteNotice = async (id) => {
        if (window.confirm('Delete this notice?')) {
            try {
                await api.delete(`/notices/${id}`);
                setMessage('Notice deleted');
                fetchNotices();
            } catch (error) {
                setMessage('Error deleting notice');
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
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <Megaphone className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Notice Board</h1>
                </div>
                {user?.role === 'ADMIN' && (
                    <button 
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
                    >
                        <Plus className="w-5 h-5" /> Post Notice
                    </button>
                )}
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center justify-between ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    <span>{message}</span>
                    <button onClick={() => setMessage('')} className="hover:opacity-70"><X className="w-5 h-5" /></button>
                </div>
            )}

            <div className="grid gap-6">
                {notices.length > 0 ? (
                    notices.map((notice) => (
                        <div key={notice.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{notice.title}</h2>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(notice.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {notice.createdBy?.name || 'Admin'}
                                        </span>
                                    </div>
                                </div>
                                {user?.role === 'ADMIN' && (
                                    <button 
                                        onClick={() => handleDeleteNotice(notice.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No notices yet</h3>
                        <p className="text-gray-500">Important updates will appear here.</p>
                    </div>
                )}
            </div>

            {/* Post Notice Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Post New Notice</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateNotice} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Notice Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter title..."
                                    value={newNotice.title}
                                    onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Notice Content</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Enter notice details..."
                                    value={newNotice.content}
                                    onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowForm(false)} 
                                    className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 font-medium"
                                >
                                    Post Notice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;
