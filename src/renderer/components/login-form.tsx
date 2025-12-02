import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Icons } from './icons';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // React Router의 navigate 훅

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Simulating a login API call
      const loginSuccess = true; // Replace with actual API logic
      if (loginSuccess) {
        // 성공 시 /home으로 라우팅
        navigate('/home');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 3000);
  }

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          placeholder='name@example.com'
          type='email'
          autoCapitalize='none'
          autoComplete='email'
          autoCorrect='off'
          disabled={isLoading}
          // required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          disabled={isLoading}
          // required
        />
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Checkbox id='remember' />
          <label
            htmlFor='remember'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Remember me
          </label>
        </div>
        <a
          href='#'
          className='text-sm text-blue-600 hover:underline dark:text-blue-400'
        >
          Forgot password?
        </a>
      </div>
      <Button className='w-full' type='submit' disabled={isLoading}>
        {isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
        Sign In
      </Button>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-white px-2 text-gray-500 dark:bg-gray-800'>
            Or continue with
          </span>
        </div>
      </div>
      <div className='flex gap-4'>
        <Button variant='outline' className='w-full' type='button'>
          <Icons.gitHub className='mr-2 h-4 w-4' /> GitHub
        </Button>
        <Button variant='outline' className='w-full' type='button'>
          <Icons.google className='mr-2 h-4 w-4' /> Google
        </Button>
      </div>
      <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
        Don&apos;t have an account?{' '}
        <a
          href='#'
          className='font-semibold text-blue-600 hover:underline dark:text-blue-400'
        >
          Sign up
        </a>
      </p>
    </form>
  );
}
