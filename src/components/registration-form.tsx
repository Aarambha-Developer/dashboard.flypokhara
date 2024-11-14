'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import requestHelper from '@/utils/request-helper';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  contact: z.string().regex(/^\d{10}$/, 'Contact must be a 10-digit number'),
  about: z.string().min(10, 'About must be at least 10 characters long'),
  role: z.enum(['AGENCY', 'ADMIN']),
  confirmPassword: z.string(),
});

type FormData = z.infer<typeof UserSchema>;

export function RegisterForm({ role }: { role: string | undefined }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    contact: '',
    about: '',
    role: 'AGENCY',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, role: value as FormData['role'] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = UserSchema.safeParse(formData);
    if (result.success) {
      await requestHelper.post({
        endPoint: 'http://localhost:8080/auth/register',
        data: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contact: formData.contact,
          about: formData.about,
          role: formData.role,
        },
        success: async (message: string, data: any) => {
          console.log(data, 'Registered in data');
          toast.success(message);
          setLoading(false);
          router.push('/login');
          return;
        },
        failure: (error: any) => {
          toast.error(error.message);
          setLoading(false);
          return;
        },
      });
    } else {
      const newErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0] as keyof FormData] = issue.message;
        }
      });
      setErrors(newErrors);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 max-w-2xl mx-auto p-6 bg-white mt-10 rounded-lg shadow'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Register</h1>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className='text-sm text-red-500'>{errors.email}</p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className='text-sm text-red-500'>{errors.password}</p>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className='text-sm text-red-500'>{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='contact'>Contact</Label>
        <Input
          id='contact'
          name='contact'
          value={formData.contact}
          onChange={handleChange}
        />
        {errors.contact && (
          <p className='text-sm text-red-500'>{errors.contact}</p>
        )}
      </div>
      {role === 'ADMIN' && (
        <div className='space-y-2'>
          <Label htmlFor='role'>Role</Label>
          <Select
            onValueChange={handleSelectChange}
            defaultValue={formData.role}>
            <SelectTrigger>
              <SelectValue placeholder='Select a role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='AGENCY'>Agency</SelectItem>
              <SelectItem value='ADMIN'>Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className='text-sm text-red-500'>{errors.role}</p>}
        </div>
      )}

      <div className='space-y-2'>
        <Label htmlFor='about'>About</Label>
        <Textarea
          id='about'
          name='about'
          value={formData.about}
          onChange={handleChange}
        />
        {errors.about && <p className='text-sm text-red-500'>{errors.about}</p>}
      </div>

      <Button type='submit' className='w-full'>
        Register
      </Button>
    </form>
  );
}
