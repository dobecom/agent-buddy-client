import { Home, Bell, Globe, Settings } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const navItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: Bell, label: 'Notifications' },
  { icon: Globe, label: 'Sites' },
  { icon: Settings, label: 'Settings' },
];

export function Sidebar() {
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
                    item.active ? 'bg-gray-700' : ''
                  }`}
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
