import { AccumulatedHistory } from '../components/AccumulatedHistory';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { TotalBonusHistory } from '../components/TotalBonusHistory';
import { WebsiteInformation } from '../components/WebsiteInformation';

const Home = () => {
  return (
    <div className='flex h-screen min-h-[900px] min-w-[1300px]'>
      <Sidebar />
      <main className='flex-1 overflow-hidden'>
        <Header />
        <div className='p-6 space-y-6 overflow-y-auto h-[calc(100vh-64px)]'>
          <AccumulatedHistory />
          <TotalBonusHistory />
          <WebsiteInformation />
        </div>
      </main>
    </div>
  );
};

export default Home;
