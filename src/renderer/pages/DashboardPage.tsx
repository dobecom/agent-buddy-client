import { AccumulatedHistory } from '../components/AccumulatedHistory';
import { TotalBonusHistory } from '../components/TotalBonusHistory';
import { WebsiteInformation } from '../components/WebsiteInformation';

const DashboardPage = () => {
  return (
    <>
      <AccumulatedHistory />
      <TotalBonusHistory />
      <WebsiteInformation />
    </>
  );
};

export default DashboardPage;


