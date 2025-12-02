import { Card, CardContent } from './ui/card';

const bonusItems = [
  { logo: '/placeholder.svg', points: 500, time: '2 hours' },
  { logo: '/placeholder.svg', points: 300, time: '1 hour' },
  { logo: '/placeholder.svg', points: 200, time: '30 minutes' },
  { logo: '/placeholder.svg', points: 200, time: '30 minutes' },
  { logo: '/placeholder.svg', points: 200, time: '30 minutes' },
  { logo: '/placeholder.svg', points: 200, time: '30 minutes' },
  { logo: '/placeholder.svg', points: 200, time: '30 minutes' },
];

export function TotalBonusHistory() {
  return (
    <section>
      <h2 className='text-xl font-semibold mb-4'>Total Bonus History</h2>
      <div className='flex space-x-4 overflow-x-auto pb-4'>
        {bonusItems.map((item, index) => (
          <Card key={index} className='w-64 flex-shrink-0'>
            <CardContent className='p-4'>
              <img
                src={item.logo}
                alt='Website logo'
                className='w-16 h-16 mb-2'
              />
              <p className='text-2xl font-bold'>{item.points} points</p>
              <p className='text-sm text-gray-500'>Saved {item.time}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
