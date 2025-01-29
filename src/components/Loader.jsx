import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-400 animate-spin absolute top-4 left-4"></div>
                <div className="h-8 w-8 rounded-full border-t-4 border-b-4 border-blue-300 animate-spin absolute top-8 left-8"></div>
            </div>
        </div>
    );
};

export default Loader;