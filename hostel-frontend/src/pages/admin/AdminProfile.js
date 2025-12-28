import React from 'react';
import { User, Bell, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
    const { user, logout } = useAuth();

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Administrator Profile</h1>
            <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                        <User className="w-12 h-12 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Administrator'}</h2>
                    <p className="text-indigo-600 font-medium">System Administrator</p>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <Bell className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</p>
                            <p className="text-gray-900 font-medium">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="bg-green-50 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Role</p>
                            <p className="text-gray-900 font-medium">{user?.role}</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-bold"
                    >
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;