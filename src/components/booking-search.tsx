'use client';
import React from 'react';
import { Input } from './ui/input';
import Link from 'next/link';

const BookingSearch = () => {
  const [search, setSearch] = React.useState<string>('');
    return (
        <div  className='flex items-center border border-primary rounded-lg '>
      <Input
                value={search}
                className='rounded-r-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
        onChange={(e) => setSearch(e.target.value)}
        placeholder='Passenger name'
      />
      <Link
        href={'/booking?search=' + search}
        className={'bg-primary text-white py-1.5 px-2 rounded'}>
        Search
      </Link>
    </div>
  );
};

export default BookingSearch;
