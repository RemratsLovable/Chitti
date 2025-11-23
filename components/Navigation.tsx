import React from 'react';
import { Home, Activity, Wallet, Users, User } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  currentView: ViewState;
  onChange: (view: ViewState) => void;
  disabled?: boolean;
}

const Navigation: React.FC<Props> = ({ currentView, onChange, disabled }) => {
  const navItems: { id: ViewState; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Home' },
    { id: 'feed', icon: <Users size={20} />, label: 'Feed' },
    { id: 'session', icon: <Activity size={24} />, label: 'Meditate' },
    { id: 'wallet', icon: <Wallet size={20} />, label: 'Wallet' },
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-neuro-900/90 backdrop-blur-md border-t border-neuro-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !disabled && onChange(item.id)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              currentView === item.id 
                ? 'text-neuro-accent' 
                : 'text-slate-500 hover:text-slate-300'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <div className={`${currentView === item.id && item.id === 'session' ? 'bg-neuro-accent/20 p-2 rounded-full -mt-4 ring-2 ring-neuro-900' : ''}`}>
                {item.icon}
            </div>
            {item.id !== 'session' && (
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;