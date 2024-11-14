import BookingForm from '@/components/booking-form/booking-form';
import { FlightBookingsTableComponent } from '@/components/flight-bookings-table';
import React from 'react';

export default function Booking() {
  return (
    <div className='mx-auto max-w-4xl  justify-center items-center '>
      <BookingForm />
      <FlightBookingsTableComponent />
    </div>
  );
}
