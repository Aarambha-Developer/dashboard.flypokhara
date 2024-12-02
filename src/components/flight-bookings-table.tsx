"use client";

import { Fragment, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationWithLinks } from "./ui/pagination-with-links";
import requestHelper from "@/utils/request-helper";
import { getCookie } from "@/lib/cookie-handler";
import toast from "react-hot-toast";
import {
  BookingStatusSelectComponent,
  StatusType,
} from "./booking-status-select";
import BookingSearch from "./booking-search";
import UpdateForm from "./airport/update-form";

export type FlightBooking = {
  status: StatusType | undefined;
  id: number;
  userId: number;
  pilot: {
    id: number;
    name: string;
  } | null;
  flightDate: string;
  packageId: number;
  nationality: string;
  totalPrice: number;

  discount: number;
  prePayment: number;
  flightType: string;
  paymentMethod: string;
  includes: boolean;
  commissionMin: number;
  commissionMax: number;
  user: {
    name: string;
  };
  package: {
    title: string;
    duration: string;
  };
  pName: string;
  pId: string;
  description: string;
};

export type meta = {
  total: number;
  page: number;
  lastPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

// const flightBookings: FlightBooking[] = [];

export function FlightBookingsTableComponent({
  bookings,
  role,
  meta,
  pilots,
  aircrafts,
}: {
  bookings: FlightBooking[] | undefined;
  role: string | undefined;
  meta: meta;
  pilots: {
    id: number;
    name: string;
  }[];
  aircrafts: {
    id: number;
    aircraftNo: string;
  }[];
}) {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const flightBookings = bookings;
  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const [perPage, setPerPage] = useState(10);
  async function handleStatusChange(id: number, status: StatusType) {
    await requestHelper.patch({
      endPoint: `${process.env.NEXT_PUBLIC_API_URL}/booking/status/${id}`,
      data: { status },
      token: await getCookie("access_token"),
      success: (message: string, data: any) => {
        toast.success(message);
        router.refresh();
      },
      failure: (error: any) => {
        toast.error(error.message);
      },
    });
  }

  return (
    <>
      <div className='flex items-center w-full justify-between'>
        <h2 className='text-xl m-4   rounded-lg w-fit p-3'>Boooking History</h2>
        <div>
          <BookingSearch />
        </div>
        {role !== 'AIRPORT' && (
          <Link
            href='/booking/add'
            className='m-4 px-4 py-2 bg-gray-800 text-white rounded-sm'>
            Add Booking
          </Link>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'></TableHead>
            <TableHead className='flex'>
              ID
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  router.push(
                    `/booking?sortBy=id&sortOrder=${
                      searchParams?.get('sortOrder') === 'asc' ? 'desc' : 'asc'
                    }`
                  )
                }>
                {searchParams?.get('sortBy') === 'id' &&
                searchParams?.get('sortOrder') === 'asc' ? (
                  <ChevronUpIcon className='h-4 w-4' />
                ) : (
                  <ChevronDownIcon className='h-4 w-4' />
                )}
              </Button>
            </TableHead>
            <TableHead>
              Flight Date{' '}
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  router.push(
                    `/booking?sortBy=id&sortOrder=${
                      searchParams?.get('sortOrder') === 'asc' ? 'desc' : 'asc'
                    }`
                  )
                }>
                {searchParams?.get('sortBy') === 'createdAt' &&
                searchParams?.get('sortOrder') === 'asc' ? (
                  <ChevronUpIcon className='h-4 w-4' />
                ) : (
                  <ChevronDownIcon className='h-4 w-4' />
                )}
              </Button>
            </TableHead>
            <TableHead>
              Country{' '}
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  router.push(
                    `/booking?sortBy=nationality&sortOrder=${
                      searchParams?.get('sortOrder') === 'asc' ? 'desc' : 'asc'
                    }`
                  )
                }>
                {searchParams?.get('sortBy') === 'nationality' &&
                searchParams?.get('sortOrder') === 'asc' ? (
                  <ChevronUpIcon className='h-4 w-4' />
                ) : (
                  <ChevronDownIcon className='h-4 w-4' />
                )}
              </Button>
            </TableHead>
            <TableHead>
              Passenger Name
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  router.push(
                    `/booking?sortBy=pName&sortOrder=${
                      searchParams?.get('sortOrder') === 'asc' ? 'desc' : 'asc'
                    }`
                  )
                }>
                {searchParams?.get('sortBy') === 'pName' &&
                searchParams?.get('sortOrder') === 'asc' ? (
                  <ChevronUpIcon className='h-4 w-4' />
                ) : (
                  <ChevronDownIcon className='h-4 w-4' />
                )}
              </Button>
            </TableHead>

            <TableHead>Agency Name</TableHead>
            <TableHead>Status</TableHead>
            {role == 'ADMIN' && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {flightBookings &&
            flightBookings.map((booking, index) => (
              // console.log("booking", booking),
              // console.log("role", role),
              <Fragment key={booking.id}>
                <TableRow key={`${index}-row`}>
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
                  <TableCell>{format(booking.flightDate, 'PPP')}</TableCell>
                  <TableCell>
                    {booking.nationality
                      ?.split(' ')
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(' ')}
                  </TableCell>
                  <TableCell>{booking.pName}</TableCell>
                  <TableCell>{booking.user?.name}</TableCell>
                  <TableCell>
                    <BookingStatusSelectComponent
                      bookingId={booking.id}
                      role={role}
                      initialStatus={booking.status}
                      onStatusChange={handleStatusChange}
                    />
                  </TableCell>
                  {role == 'ADMIN' && (
                    <TableCell className=' flex  items-center'>
                      <Link href={`/booking/${booking.id}/edit`}>
                        <Pencil className='h-4 w-4' />{' '}
                      </Link>
                    </TableCell>
                  )}
                </TableRow>
                {expandedRows[booking.id] && (
                  <TableRow key={`${index}-details`}>
                    <TableCell colSpan={7}>
                      {role !== 'AIRPORT' ? (
                        <div className='p-4 bg-muted rounded-md '>
                          <h3 className='font-semibold mb-2'>
                            Booking Details
                          </h3>
                          <dl className='grid grid-cols-2  gap-x-4 gap-y-2'>
                            {role === 'ADMIN' && (
                              <>
                                <dt className='font-medium '>
                                  Booking Done by :
                                </dt>
                                <dd>{booking.user.name}</dd>
                              </>
                            )}
                            <dt className='font-medium '>Passenger Name :</dt>
                            <dd>{booking.pName}</dd>
                            <dt className='font-medium'>Pilot Name:</dt>
                            <dd>
                              {booking.pilot?.name ? booking.pilot?.name : '-'}
                            </dd>
                            <dt className='font-medium'>Package :</dt>
                            <dd>
                              {booking.package.title} &nbsp;
                              <span className='font-[600]'>
                                {' '}
                                ({booking.package.duration} minutes)
                              </span>
                            </dd>
                            <dt className='font-medium'>Discount:</dt>
                            <dd>{booking.discount}</dd>
                            <dt className='font-medium'>Pre-payment:</dt>
                            <dd>{booking.prePayment}</dd>
                            <dt className='font-medium'>Payment Method:</dt>
                            <dd>
                              {booking.paymentMethod
                                ? booking.paymentMethod
                                : '-'}
                            </dd>
                            <dt className='font-medium'>
                              Includes Photos/Videos:
                            </dt>
                            <dd>{booking.includes ? 'Yes' : 'No'}</dd>
                            <dt className='font-medium'>Commission NPR:</dt>
                            <dd>Rs. {booking.commissionMin} /-</dd>
                            <dt className='font-medium'>Commission USD:</dt>
                            <dd>USD $ {booking.commissionMax}</dd>
                            <dt className='font-medium '>Note :</dt>
                            <dd>{booking.description}</dd>
                          </dl>
                        </div>
                      ) : (
                        <div className='p-2 bg-muted rounded-md '>
                          <h3 className='font-semibold mb-2'></h3>
                          <dl className='grid gap-x-4 gap-y-2'>
                            <UpdateForm
                              pilots={pilots}
                              aircrafts={aircrafts}
                              id={booking.id}
                              pilotId={booking.pilot?.id}
                            />
                          </dl>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
        </TableBody>
      </Table>

      {bookings ? (
        <PaginationWithLinks
          page={meta.page}
          pageSize={perPage}
          totalCount={meta.total}
        />
      ) : (
        <div className='flex justify-center items-center h-20 mx-auto '>
          No Data Found
        </div>
      )}
    </>
  );
}
