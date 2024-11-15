'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

export type FlightBooking = {
  id: number;
  userId: number;
  pilotId: number;
  flightDate: string;
  packageId: number;
  nationality: string;
  totalPrice: number;
  discount: number;
  prePayment: number;
  flightType: string;
  paymentMethod: string;
  includes: boolean;
  commission: number;
};

// const flightBookings: FlightBooking[] = [];

export function FlightBookingsTableComponent({
  bookings,
}: {
  bookings: FlightBooking[];
}) {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const flightBookings = bookings;
  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className='flex items-center w-full justify-between'>
        <h2 className='text-xl m-4 border rounded-lg w-fit p-3'>
          Boooking History
        </h2>
        <Link
          href='/booking/add'
          className='m-4 px-4 py-2 bg-blue-500 text-white rounded-lg'>
          Add Booking
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Flight Date</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Flight Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flightBookings.map((booking, index) => (
            <>
              <TableRow key={index}>
                <TableCell>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => toggleRowExpansion(booking.id)}>
                    {expandedRows[booking.id] ? (
                      <ChevronUpIcon className='h-4 w-4' />
                    ) : (
                      <ChevronDownIcon className='h-4 w-4' />
                    )}
                  </Button>
                </TableCell>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.flightDate}</TableCell>
                <TableCell>{booking.nationality}</TableCell>
                <TableCell>{booking.totalPrice}</TableCell>
                <TableCell>{booking.flightType}</TableCell>
              </TableRow>
              {expandedRows[booking.id] && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className='p-4 bg-muted rounded-md'>
                      <h3 className='font-semibold mb-2'>Additional Details</h3>
                      <dl className='grid grid-cols-2 gap-x-4 gap-y-2'>
                        <dt className='font-medium'>User ID:</dt>
                        <dd>{booking.userId}</dd>
                        <dt className='font-medium'>Pilot ID:</dt>
                        <dd>{booking.pilotId}</dd>
                        <dt className='font-medium'>Package ID:</dt>
                        <dd>{booking.packageId}</dd>
                        <dt className='font-medium'>Discount:</dt>
                        <dd>{booking.discount}</dd>
                        <dt className='font-medium'>Pre-payment:</dt>
                        <dd>{booking.prePayment}</dd>
                        <dt className='font-medium'>Payment Method:</dt>
                        <dd>{booking.paymentMethod}</dd>
                        <dt className='font-medium'>Includes:</dt>
                        <dd>{booking.includes ? 'Yes' : 'No'}</dd>
                        <dt className='font-medium'>Commission:</dt>
                        <dd>{booking.commission}</dd>
                      </dl>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
