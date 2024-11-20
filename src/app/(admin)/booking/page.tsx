import BookingForm from "@/components/booking-form/booking-form";
import { getCookie, getCookies } from "@/lib/cookie-handler";
import requestHelper from "@/utils/request-helper";
import React, { useEffect, useState } from "react";
import {
  FlightBooking,
  FlightBookingsTableComponent,
  meta,
} from "@/components/flight-bookings-table";
import { Card } from "@/components/ui/card";

export default async function Booking({ searchParams }: { searchParams: any }) {
  let role = await getCookie("role");
  const bookings: FlightBooking[] = [];
  // console.log("params", params);
  let meta: meta = {
    total: 0,
    page: 1,
    lastPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  // console.log("searchParams", await searchParams);
  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/booking`,
    params: await searchParams,
    token: await getCookie("access_token"),
    success: (message: string, data: any) => {
      bookings.push(...data.data.bookings);
    
      meta = data.data.meta;
    },
    failure: (error: any) => {},
  });
  return (
    <Card className="my-2 mx-4  justify-center items-center ">
      <FlightBookingsTableComponent
        bookings={bookings}
        role={role}
        meta={meta}
      />
    </Card>
  );
}
