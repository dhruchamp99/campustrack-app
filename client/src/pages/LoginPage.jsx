import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password, role);
            navigate('/dashboard');
        } catch (error) {
            alert('Login Failed: ' + (error.response?.data?.message || 'Server error'));
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
            style={{
                backgroundImage: 'url(https://www.pacific-soe.ac.in/media/265745/1.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Dark overlay for better readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            {/* Decorative floating elements - subtle */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl hidden md:block"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl hidden md:block"></div>


            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-white/60">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-5xl font-bold text-black mb-2 sm:mb-3">CampusTrack</h1>
                        <p className="text-gray-700 text-sm sm:text-base">Login to access your dashboard.</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 bg-gray-100 p-1.5 rounded-xl">
                        {['student', 'teacher', 'admin'].map((r) => (
                            <button
                                type="button"
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 text-xs sm:text-sm font-medium rounded-lg capitalize transition-all duration-200 ${role === r
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        {/* Username/Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-black">
                                {role === 'student' ? 'Enrollment Number' : 'Email Address'}
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <input
                                    type={role === 'student' ? 'text' : 'email'}
                                    placeholder={role === 'student' ? 'cs101' : 'teacher@example.com'}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-black">Password</label>
                            <div className="relative">
                                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-3 sm:py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default LoginPage;
