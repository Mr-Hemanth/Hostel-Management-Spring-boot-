import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, XCircle } from 'lucide-react';
import api from '../../services/api';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [studentSearchTerm, setStudentSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/students');
            if (response.status === 200) {
                setStudents(response.data);
                setFilteredStudents(response.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            setMessage('Error fetching students');
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setStudentSearchTerm(searchTerm);
        const filtered = students.filter(student => 
            student.user?.name.toLowerCase().includes(searchTerm) ||
            student.user?.email.toLowerCase().includes(searchTerm) ||
            student.room?.roomNumber.toLowerCase().includes(searchTerm)
        );
        setFilteredStudents(filtered);
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
                <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
                <button 
                    onClick={fetchStudents}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {message && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center justify-between">
                    <span>{message}</span>
                    <button onClick={() => setMessage('')}><XCircle className="w-5 h-5" /></button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                        value={studentSearchTerm}
                        onChange={handleStudentSearch}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Room</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{student.user?.name}</td>
                                        <td className="px-4 py-3">{student.user?.email}</td>
                                        <td className="px-4 py-3">
                                            {student.room ? (
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                    Room {student.room.roomNumber}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                                    Not Assigned
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                                        No students found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;