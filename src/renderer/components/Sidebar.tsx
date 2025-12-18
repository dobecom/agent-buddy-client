import React from 'react';
import { Home, Bell, Globe, Settings } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

type NavKey = 'Dashboard' | 'Notifications' | 'Sites' | 'Settings';

const navItems: { icon: React.ElementType; label: NavKey }[] = [
  { icon: Home, label: 'Dashboard' },
  { icon: Bell, label: 'Notifications' },
  { icon: Globe, label: 'Sites' },
  { icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  activeNav: NavKey;
  onChange: (nav: NavKey) => void;
}

export function Sidebar({ activeNav, onChange }: SidebarProps) {
  return (
    <aside className='w-16 bg-gray-800 text-white flex flex-col items-center py-4 space-y-8'>
      <div className='text-2xl font-bold'>M</div>
      <nav className='flex flex-col items-center space-y-4'>
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  className={`p-2 rounded-lg hover:bg-gray-700 transition-colors ${
                    item.label === activeNav ? 'bg-gray-700' : ''
                  }`}
                  onClick={() => onChange(item.label)}
                >
                  <item.icon className='w-6 h-6' />
                </button>
              </TooltipTrigger>
              <TooltipContent side='right'>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
