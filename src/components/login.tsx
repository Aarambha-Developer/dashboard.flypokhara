'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import requestHelper from '@/utils/request-helper';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: 'Invalid email format',
      }));
      return;
    }
    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters',
      }));
      return;
    }
    //

    requestHelper.post({
      endPoint: 'http://localhost:8080/auth/login',
      data: {
        email: email,
        password: password,
      },
      success: (message: string, data: any) => {
        setEmail('');
        setPassword('');
        toast.success(message);
        setLoading(false);
      },
      failure: (error: any) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className='flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Login
          </CardTitle>
          <CardDescription className='text-center'>
            Welcome back! Please login to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    email: validateEmail(e.target.value)
                      ? ''
                      : 'Invalid email format',
                  }));
                }}
              />
              {errors.email && (
                <p className='text-sm text-red-500 flex items-center'>
                  <AlertCircle className='w-4 h-4 mr-1' />
                  {errors.email}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      password:
                        e.target.value.length < 8
                          ? 'Password must be at least 8 characters'
                          : '',
                    }));
                  }}
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 transform -translate-y-1/2'
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 text-gray-500' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-500' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-sm text-red-500 flex items-center'>
                  <AlertCircle className='w-4 h-4 mr-1' />
                  {errors.password}
                </p>
              )}
            </div>
            <div className='flex items-center justify-between'>
              <Link
                href='/forgot-password'
                className='text-sm text-primary hover:underline'>
                Forgot Password?
              </Link>
              <Link
                href='/register'
                className='text-sm text-primary hover:underline'>
                Don't have an account?
              </Link>
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full'>
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
