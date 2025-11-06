
import React from 'react';
import Button from './Button';

interface HeaderProps {
    onNavigate: (view: 'gallery' | 'admin') => void;
    userRole: 'admin' | 'guest' | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, userRole, onLogout }) => {
  return (
    <header className="bg-background/60 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-40 shadow-xl">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <img src="https://i.postimg.cc/zvWqhmB3/7c03777d88ee2dffef97e812961c7b3d.png" alt="Product Feedback Logo" className="h-14 w-14 rounded-2xl flex-shrink-0" />
            <div>
                <h1 
                    className="text-3xl md:text-4xl font-bold text-foreground tracking-tight cursor-pointer"
                    onClick={() => onNavigate('gallery')}
                >
                  Product Feedback
                </h1>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">Help us improve by sharing your valuable insights.</p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            {userRole === 'admin' && (
                <Button 
                    onClick={() => onNavigate('admin')}
                    variant="secondary"
                >
                    Admin Panel
                </Button>
            )}
            <Button 
                onClick={onLogout}
                variant="outline"
            >
                Logout
            </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;