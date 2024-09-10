import React from 'react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-orange-50">
            <div className="relative">
                <div className="w-20 h-20 border-orange-300 border-2 rounded-full"></div>
                <div className="w-20 h-20 border-orange-500 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-10 h-10 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default Loading;