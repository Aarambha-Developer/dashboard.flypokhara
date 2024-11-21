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
  let token = await getCookie("access_token");

  const bookings: FlightBooking[] = [];
  let pilots: {
    id: number;
    name: string;
  }[] = [];

  let aircrafts: {
    id: number;
    aircraftNo: string;
  }[] = [];
  // console.log("params", params);
  let meta: meta = {
    total: 0,
    page: 1,
    lastPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/pilot`,
    token: token,
    success: (message: string, data: any) => {
      console.log("pilot from ", data);
      pilots = data.data;
    },
    failure: (error: any) => {
      console.log(error);
    },
  });

  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/aircraft`,
    token: token,
    success: (message: string, data: any) => {
      aircrafts = data.data;
    },
    failure: (error: any) => {},
  });
  // console.log("searchParams", await searchParams);
  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/booking`,
    params: await searchParams,
    token: token,
    success: (message: string, data: any) => {
      bookings.push(...data.data.bookings);

      meta = data.data.meta;
    },
    failure: (error: any) => {},
  });

  // console.log("pilot from ", pilots);

  return (
    <Card className="my-2 mx-4  justify-center items-center ">
      <FlightBookingsTableComponent
        bookings={bookings}
        role={role}
        meta={meta}
        pilots={pilots}
        aircrafts={aircrafts}
      />
    </Card>
  );
}
