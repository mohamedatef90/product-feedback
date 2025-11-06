import React from 'react';

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#8e9eab] to-[#eef2f3] flex flex-col items-center justify-center z-[100]">
            <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-5 h-5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-5 h-5 rounded-full bg-primary animate-bounce"></div>
            </div>
            <p className="mt-8 text-xl text-foreground font-semibold tracking-wide text-center px-4">
                Preparing your experience...
            </p>
        </div>
    );
};

export default LoadingScreen;
