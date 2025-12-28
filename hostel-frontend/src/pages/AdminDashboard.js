import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, 
  Hotel, 
  Wrench, 
  Clock,
  RefreshCw,
  LayoutDashboard
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

const AdminDashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);
    const [roomBookingRequests, setRoomBookingRequests] = useState([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setMessage('');
            
            const results = await Promise.allSettled([
                api.get('/admin/rooms'),
                api.get('/admin/students'),
                api.get('/admin/room-booking-requests'),
                api.get('/admin/maintenance-requests')
            ]);

            if (results[0].status === 'fulfilled') {
                setRooms(results[0].value.data);
            } else {
                console.error('Error fetching rooms:', results[0].reason);
            }

            if (results[1].status === 'fulfilled') {
                setStudents(results[1].value.data);
            } else {
                console.error('Error fetching students:', results[1].reason);
            }

            if (results[2].status === 'fulfilled') {
                setRoomBookingRequests(results[2].value.data);
            } else {
                console.error('Error fetching booking requests:', results[2].reason);
            }

            if (results[3].status === 'fulfilled') {
                setMaintenanceRequests(results[3].value.data);
            } else {
                console.error('Error fetching maintenance requests:', results[3].reason);
            }

            if (results.some(r => r.status === 'rejected')) {
                setMessage('Some dashboard data could not be loaded. Please check the console for details.');
            }
        } catch (error) {
            console.error('Error in fetchData:', error);
            setMessage('Error fetching dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Rooms', value: rooms.length, icon: Hotel, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Students', value: students.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: 'Pending Room Changes', value: roomBookingRequests.filter(r => r.status === 'PENDING').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'Pending Maintenance', value: maintenanceRequests.filter(r => r.status === 'PENDING').length, icon: Wrench, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    const occupancyData = [
        { name: 'Occupied', value: rooms.filter(r => r.occupied).length },
        { name: 'Available', value: rooms.filter(r => !r.occupied).length },
    ];

    const requestsData = [
        { name: 'Room Changes', total: roomBookingRequests.length, pending: roomBookingRequests.filter(r => r.status === 'PENDING').length },
        { name: 'Maintenance', total: maintenanceRequests.length, pending: maintenanceRequests.filter(r => r.status === 'PENDING').length }
    ];

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
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard Overview</h1>
                <button 
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {message && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center justify-between">
                    <span>{message}</span>
                    <button onClick={() => setMessage('')}>×</button>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Room Occupancy</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={occupancyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {occupancyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {occupancyData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-sm text-gray-600">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4">Request Overview</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={requestsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Total" />
                                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-600 rounded-lg">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-indigo-900">Quick Navigation</h3>
                        <p className="text-indigo-700 mb-4">Access detailed management pages from the sidebar or using the links below.</p>
                        <div className="flex flex-wrap gap-3">
                            {['Rooms', 'Students', 'Bookings', 'Maintenance'].map((page) => (
                                <button
                                    key={page}
                                    onClick={() => window.location.href = `/${page.toLowerCase()}`}
                                    className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm"
                                >
                                    Manage {page}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
