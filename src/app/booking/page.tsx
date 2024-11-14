import BookingForm from "@/components/booking-form/booking-form";
import { getCookie, getCookies } from "@/lib/cookie-handler";
import requestHelper from "@/utils/request-helper";
import React, { useEffect, useState } from "react";
import { FlightBookingsTableComponent } from "@/components/flight-bookings-table";

export default async function Booking() {
  let token = await getCookie("access_token");
  const role = await getCookie("role");
  let pilots: {
    id: number;
    name: string;
  }[] = [];
  let packages: {
    id: number;
    title: string;
  }[] = [];

  await requestHelper.get({
    endPoint: "http:/192.168.1.189:8080/pilot",
    token: token,
    success: (message: string, data: any) => {
      pilots = data.data;
    },
    failure: (error: any) => {
      console.log(error);
    },
  });

  await requestHelper.get({
    endPoint: "http:/192.168.1.189:8080/packages",
    token: token,
    success: (message: string, data: any) => {
      packages = data.data;
    },
    failure: (error: any) => {
      console.log(error);
    },
  });

  // useEffect(() => {
  //   fetchPilots();
  // }, [token]);onst role = await getCookie("role");
  //   setRole(role || "");
  // };

  // // function to fetch pilots
  // await requestHelper.get({
  //   endPoint: "http:/192.168.1.189:8080/pilots",
  //   token : token,
  // });

  // // function to fetch packages

  // useEffect(() => {
  //   fetchRole();
  // }, []);

  return (
    <div className="mx-auto max-w-4xl flex justify-center items-center ">
      <BookingForm
        role={role || ""}
        pilots={pilots}
        flightPackages={packages}
      />

      <FlightBookingsTableComponent />
    </div>
  );
}
