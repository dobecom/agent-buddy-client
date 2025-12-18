import { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import DashboardPage from './DashboardPage';
import SitesPage from './SitesPage';
import SettingsPage from './SettingsPage';
import CaseListPage from './CaseListPage';

type NavKey = 'Dashboard' | 'Notifications' | 'Sites' | 'Settings';

const Home = () => {
  const [activeNav, setActiveNav] = useState<NavKey>('Dashboard');

  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <DashboardPage />;
      case 'Notifications':
        return <CaseListPage />;
      case 'Sites':
        return <SitesPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className='flex h-screen min-h-[900px] min-w-[1300px]'>
      <Sidebar activeNav={activeNav} onChange={setActiveNav} />
      <main className='flex-1 overflow-hidden'>
        <Header />
        <div className='p-6 space-y-6 overflow-y-auto h-[calc(100vh-64px)]'>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Home;
