import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Hotel, 
  Users, 
  Wrench, 
  Bell, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  RefreshCw
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Rooms', path: '/rooms', icon: Hotel },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Room Change', path: '/room-changes', icon: RefreshCw },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Notices', path: '/notices', icon: Bell },
  ];

  const studentLinks = [
    { name: 'Dashboard', path: '/student-dashboard', icon: LayoutDashboard },
    { name: 'Room Change', path: '/my-room', icon: RefreshCw },
    { name: 'Maintenance', path: '/my-maintenance', icon: Wrench },
    { name: 'Notices', path: '/notices', icon: Bell },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-indigo-700 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Hotel className="w-8 h-8" />
            <span>HostelHub</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === link.path 
                  ? 'bg-indigo-800 text-white' 
                  : 'hover:bg-indigo-600 text-indigo-100'
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-600">
          <Link
            to={user?.role === 'ADMIN' ? '/admin-profile' : '/student-profile'}
            className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
              location.pathname === (user?.role === 'ADMIN' ? '/admin-profile' : '/student-profile')
                ? 'bg-indigo-800'
                : 'hover:bg-indigo-600'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-indigo-300 truncate">{user?.role}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-600 text-indigo-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="bg-indigo-700 text-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Hotel className="w-6 h-6" />
            <span>HostelHub</span>
          </h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="bg-indigo-700 text-white px-4 py-6 absolute w-full z-50 shadow-xl">
            <nav className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    location.pathname === link.path ? 'bg-indigo-800' : ''
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="hidden md:flex bg-white shadow-sm h-16 items-center px-8 justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {links.find(l => l.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
