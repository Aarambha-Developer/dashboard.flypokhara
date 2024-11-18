import BookingForm from '@/components/booking-form/booking-form';
import { getCookie } from '@/lib/cookie-handler';
import requestHelper from '@/utils/request-helper';
import React from 'react';

const BookingFormPage = async () => {
  let token = await getCookie('access_token');
  const role = await getCookie('role');
  let pilots: {
    id: number;
    name: string;
  }[] = [];
  let packages: {
    id: number;
    title: string;
  }[] = [];

  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/pilot`,
    token: token,
    success: (message: string, data: any) => {
      pilots = data.data;
    },
    failure: (error: any) => {},
  });

  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/packages`,
    token: token,
    success: (message: string, data: any) => {
      packages = data.data;
    },
    failure: (error: any) => {},
  });

  return (
    <BookingForm
      bookingDetails={undefined}
      role={role || ''}
      pilots={pilots}
      flightPackages={packages}
    />
  );
};

export default BookingFormPage;
