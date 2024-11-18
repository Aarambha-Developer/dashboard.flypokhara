import BookingForm, {
  BookingFormSchema,
} from '@/components/booking-form/booking-form';
import { getCookie } from '@/lib/cookie-handler';
import requestHelper from '@/utils/request-helper';
import React from 'react';

const EditBooking = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
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
  let bookingDetails: BookingFormSchema & { id: number | undefined } = {
    pilotId: 0,
    packageId: 0,
    nationality: '',
    discount: 0,
    prePayment: 0,
    paymentMethod: '',
    pName: '',
    pId: '',
    pIdType: '',
    flightDate: new Date(),
    ticketNo: '',
    aircraftType: 'OPEN',
    flightType: 'COMMERCIAL',
    includes: false,
    id: undefined,
  };
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
  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/booking/${id}`,
    token: token,
    success: (message: string, data: any) => {
      bookingDetails = {
        id: data.data.id || undefined,
        pilotId: data.data.pilotId || undefined,
        packageId: data.data.packageId || undefined,
        nationality: data.data.nationality || '',
        discount: data.data.discount || 0,
        prePayment: data.data.prePayment || 0,
        paymentMethod: data.data.paymentMethod || '',
        pName: data.data.pName || '',
        pId: data.data.pId || '',
        pIdType: data.data.identificationType || '',
        flightDate: new Date(data.data.flightDate) || undefined,
        ticketNo: data.data.ticketNo || '',
        aircraftType: data.data.aircraftType || 'OPEN',
        flightType: data.data.flightType || 'COMMERCIAL',
        includes: data.data.includes || false,
      };
    },
    failure: (error: any) => {},
  });

  return (
    <BookingForm
      pilots={pilots}
      bookingDetails={bookingDetails}
      flightPackages={packages}
      role={role || ''}
    />
  );
};

export default EditBooking;
