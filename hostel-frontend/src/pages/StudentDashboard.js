import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  User, 
  Home, 
  Wrench, 
  AlertCircle, 
  RefreshCw,
  MapPin,
  Bell
} from 'lucide-react';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setMessage('');
            
            const results = await Promise.allSettled([
                api.get('/student/profile')
            ]);

            if (results[0].status === 'fulfilled') {
                setStudentInfo(results[0].value.data);
                setLastUpdated(new Date().toLocaleTimeString());
            } else {
                console.error('Error fetching profile:', results[0].reason);
                setMessage('Error fetching dashboard data. Please check the console.');
            }
        } catch (error) {
            console.error('Error in fetchData:', error);
            setMessage('Error fetching dashboard data');
        } finally {
            setLoading(false);
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
                <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Last updated: {lastUpdated}</span>
                    <button onClick={fetchData} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {message && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center justify-between">
                    <span>{message}</span>
                    <button onClick={() => setMessage('')}>×</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <User className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{studentInfo?.user?.name}</h2>
                            <p className="text-gray-500 text-sm mb-4">{studentInfo?.user?.email}</p>
                            
                            <div className="w-full pt-4 border-t space-y-3 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500 font-medium">Room Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${studentInfo?.room ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {studentInfo?.room ? 'Assigned' : 'Not Assigned'}
                                    </span>
                                </div>
                                {studentInfo?.room && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500 font-medium">Room Number</span>
                                        <span className="text-sm font-bold text-gray-900">{studentInfo.room.roomNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Quick Tip
                        </h3>
                        <p className="text-indigo-100 text-sm leading-relaxed">
                            Need a room change or have a maintenance issue? Use the dedicated sections in the sidebar to submit requests.
                        </p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Welcome Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {studentInfo?.user?.name}!</h2>
                        <p className="text-gray-500">Here's a quick overview of your hostel status and available actions.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <button 
                                onClick={() => navigate('/my-room')}
                                className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors text-left"
                            >
                                <div className="p-3 bg-indigo-600 rounded-lg">
                                    <Home className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-indigo-900">Room Change</h4>
                                    <p className="text-sm text-indigo-700">Request a different room</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => navigate('/my-maintenance')}
                                className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors text-left"
                            >
                                <div className="p-3 bg-purple-600 rounded-lg">
                                    <Wrench className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-purple-900">Maintenance</h4>
                                    <p className="text-sm text-purple-700">Report a problem</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => navigate('/notices')}
                                className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors text-left"
                            >
                                <div className="p-3 bg-amber-600 rounded-lg">
                                    <Bell className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-amber-900">Notices</h4>
                                    <p className="text-sm text-amber-700">View latest updates</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => navigate('/student-profile')}
                                className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors text-left"
                            >
                                <div className="p-3 bg-emerald-600 rounded-lg">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900">Profile</h4>
                                    <p className="text-sm text-emerald-700">Manage your account</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Room Info */}
                    {studentInfo?.room && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-indigo-600" /> Your Room Information
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Room Number</p>
                                    <p className="text-lg font-bold text-gray-900">{studentInfo.room.roomNumber}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Capacity</p>
                                    <p className="text-lg font-bold text-gray-900">{studentInfo.room.capacity}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Occupants</p>
                                    <p className="text-lg font-bold text-gray-900">{studentInfo.room.students?.length || 1}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status</p>
                                    <p className="text-lg font-bold text-green-600">Active</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
