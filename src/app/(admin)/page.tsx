import { getCookie } from '@/lib/cookie-handler';
import requestHelper from '@/utils/request-helper';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Briefcase,
  Package,
  Calendar,
  DollarSign,
  Percent,
} from 'lucide-react';
import Link from 'next/link';
import { FlightBookingsTableComponent } from '@/components/flight-bookings-table';

export type DashboardProps = {
  totalBookings: number;
  totalPilots: number;
  totalPackages: number;
  totalUsers: number;
  maxTotal: number;
  maxCommission: number;
  minTotal: number;
  minCommission: number;
  prePayment: number;
  agencys: {
    id: number;
    name: string;
    email: string;
    contact: string;
  }[];
};

const Dashboard = async () => {
  let dashboardData: DashboardProps | undefined;
  const token = await getCookie('access_token');
  const role = await getCookie('role');
  let bookingData: any;
  let cards:
    | {
        title: string;
        value: string;
        icon: any;
        role: string[];
      }[]
    | undefined;
  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/home`,
    token,
    success: (message: string, data: any) => {
      dashboardData = data?.data;
      cards = [
        {
          title: 'Total Bookings',
          value: data?.data?.totalBookings || '-',
          icon: Calendar,
          role: ['AGENCY', 'ADMIN'],
        },
        {
          title: 'Total Pilots',
          value: data?.data?.totalPilots || '-',
          icon: Users,
          role: ['ADMIN'],
        },
        {
          title: 'Total Packages',
          value: data?.data?.totalPackages || '-',
          icon: Package,
          role: ['ADMIN'],
        },
        {
          title: 'Total Agencies',
          value: data?.data?.totalUsers || '-',
          icon: Users,
          role: ['ADMIN'],
        },
        {
          title: 'Foreign Client Total',
          value: `$ ${data?.data?.maxTotal || '-'}`,
          icon: DollarSign,
          role: ['ADMIN', 'AGENCY'],
        },
        {
          title: 'Commission from Foreign Client',
          value: `$ ${data?.data?.maxCommission || '-'}`,
          icon: DollarSign,
          role: ['ADMIN', 'AGENCY'],
        },
        {
          title: 'Local Client Total',
          value: `Rs. ${data?.data?.minTotal || '-'}`,
          icon: DollarSign,
          role: ['ADMIN', 'AGENCY'],
        },

        {
          title: 'Commission from Local Client',
          value: `Rs. ${data?.data?.minCommission || '-'}`,
          icon: DollarSign,
          role: ['ADMIN', 'AGENCY'],
        },
      ];
    },
    failure: (error: any) => {
      console.log(error, 'error');
    },
  });
  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/booking`,
    token,
    success: (message: string, data: any) => {
      bookingData = data?.data;
      console.log(bookingData);
    },
    failure: (error: any) => {
      console.log(error, 'error');
    },
  });

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <Link
          href={'/booking/add'}
          className='font-semibold border px-4 py-2 rounded-lg bg-primary text-white'>
          Add New Booking
        </Link>
      </div>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {cards?.map(
          (card, index) =>
            card.role.includes(role || '') && (
              <Card key={index}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {card.title}
                  </CardTitle>
                  <card.icon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{card.value}</div>
                </CardContent>
              </Card>
            )
        )}
      </div>
      {
        <Card>

          <FlightBookingsTableComponent
            bookings={bookingData?.bookings}
            meta={bookingData?.meta}
            role={role || ''}
          />
        </Card>
      }
    </div>
  );
};

export default Dashboard;
