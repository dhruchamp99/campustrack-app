import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    LogOut,
    GraduationCap,
    CheckSquare,
    Menu,
    X,
    Bell,
    Archive,
    FileBarChart,
    Book,
    BarChart,
    PieChart,
    TableProperties
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getLinks = () => {
        const commonLinks = [];
        if (user.role === 'admin') {
            return [
                { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
                { href: '/admin/students', label: 'Students', icon: GraduationCap },
                { href: '/admin/teachers', label: 'Teachers', icon: Users },
                { href: '/admin/subjects', label: 'Subjects', icon: BookOpen },
                { href: '/admin/holidays', label: 'Holidays', icon: Calendar },
            ];
        } else if (user.role === 'teacher') {
            return [
                { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { href: '/teacher/subjects', label: 'My Subjects', icon: BookOpen },
                { href: '/teacher/attendance', label: 'Mark Attendance', icon: CheckSquare },
                { href: '/teacher/store', label: 'Store', icon: Archive },
                { href: '/teacher/report', label: 'Attendance Report', icon: FileBarChart },
            ];
        } else {
            // Student Links (Updated)
            return [
                { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                // { href: '/student/attendance', label: 'Attendance', icon: CheckSquare }, // Removed as per request
                { href: '/student/materials', label: 'Study Materials', icon: Book },
                { href: '/student/analytics', label: 'Analytics', icon: PieChart },
                { href: '/student/time-table', label: 'Time Table', icon: TableProperties },
            ];
        }
    };

    const links = getLinks();

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 flex-col bg-card border-r border-border h-screen sticky top-0 shadow-lg z-20">
                <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">CT</div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">CampusTrack</h1>
                            <p className="text-xs text-muted-foreground">Attendance System</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.href;
                        return (
                            <Link to={link.href} key={link.href}>
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                                    {link.label}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-border/50 bg-muted/20">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
                    <div className="md:hidden flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <Menu className="w-6 h-6" />
                        </Button>
                        <span className="font-bold">CampusTrack</span>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="relative">
                            <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
                        </div>
                    </div>
                </header>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -300 }}
                            className="fixed inset-0 z-50 bg-background md:hidden"
                        >
                            <div className="p-4 flex justify-between items-center border-b">
                                <span className="font-bold text-lg">Menu</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>
                            <div className="p-4 space-y-2">
                                {links.map((link) => (
                                    <Link to={link.href} key={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted">
                                            <link.icon className="w-5 h-5" />
                                            {link.label}
                                        </div>
                                    </Link>
                                ))}
                                <Button className="w-full mt-8" variant="destructive" onClick={handleLogout}>
                                    Log Out
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-8 bg-slate-100 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mx-auto space-y-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
