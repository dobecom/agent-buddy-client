import { Plus } from 'lucide-react';
import { Button } from './ui/button';

const websites = [
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg',
];

export function WebsiteInformation() {
  return (
    <section>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>
          Look for more websites you can get points
        </h2>
        <Button variant='outline' size='sm'>
          <Plus className='w-4 h-4 mr-2' />
          Add Sites
        </Button>
      </div>
      <div className='flex space-x-4 overflow-hidden'>
        <div className='animate-marquee flex space-x-4'>
          {websites.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt='Website logo'
              className='w-16 h-16'
            />
          ))}
        </div>
        <div className='animate-marquee flex space-x-4' aria-hidden='true'>
          {websites.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt='Website logo'
              className='w-16 h-16'
            />
          ))}
        </div>
      </div>
    </section>
  );
}
