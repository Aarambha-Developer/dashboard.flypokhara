import BookingForm from '@/components/booking-form/booking-form';
import { getCookie, getCookies } from '@/lib/cookie-handler';
import requestHelper from '@/utils/request-helper';
import React, { useEffect, useState } from 'react';
import {
  FlightBooking,
  FlightBookingsTableComponent,
} from '@/components/flight-bookings-table';
import { Card } from '@/components/ui/card';

export default async function Booking() {
  const bookings: FlightBooking[] = [];
  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/booking`,
    token: await getCookie('access_token'),
    success: (message: string, data: any) => {
      bookings.push(...data.data);
    },
    failure: (error: any) => {
      console.log('error', error);
    },
  });
  return (
    <Card className='my-2 mx-4  justify-center items-center '>
      <FlightBookingsTableComponent bookings={bookings} />
    </Card>
  );
}
