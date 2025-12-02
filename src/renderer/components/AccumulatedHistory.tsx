import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';

const historyItems = [
  { logo: '/placeholder.svg', date: '2023-05-15', points: 100 },
  { logo: '/placeholder.svg', date: '2023-05-14', points: 75 },
  { logo: '/placeholder.svg', date: '2023-05-13', points: 50 },
  { logo: '/placeholder.svg', date: '2023-05-13', points: 50 },
  { logo: '/placeholder.svg', date: '2023-05-13', points: 50 },
  { logo: '/placeholder.svg', date: '2023-05-13', points: 50 },
];

export function AccumulatedHistory() {
  return (
    <section>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Accumulated History</h2>
        <Button variant='outline' size='sm'>
          <RefreshCw className='w-4 h-4 mr-2' />
          Refresh
        </Button>
      </div>
      <div className='flex space-x-4 overflow-x-auto pb-4'>
        {historyItems.map((item, index) => (
          <Card key={index} className='w-64 flex-shrink-0'>
            <CardContent className='p-4'>
              <img
                src={item.logo}
                alt='Website logo'
                className='w-16 h-16 mb-2'
              />
              <p className='font-semibold'>{item.date}</p>
              <p className='text-2xl font-bold'>{item.points} points</p>
            </CardContent>
            <CardFooter>
              <Button className='w-full'>Start</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
