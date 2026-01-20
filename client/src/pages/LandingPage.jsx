import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-white/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>

            {/* Sparkle */}
            <div className="absolute bottom-10 right-10 w-16 h-16 text-white/40">
                <svg viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" />
                </svg>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-8 max-w-3xl relative z-10"
            >
                <h1 className="text-7xl font-bold tracking-tight text-gray-900">
                    CampusTrack
                </h1>
                <p className="text-2xl text-gray-700">
                    The modern solution for attendance management. Streamline your classroom operations with ease.
                </p>
                <div className="flex justify-center gap-6 pt-8">
                    <Link to="/login">
                        <button className="px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                            Get Started
                        </button>
                    </Link>
                    <a href="#features">
                        <button className="px-10 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200">
                            Learn More
                        </button>
                    </a>
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
