"use client";

import { Fragment, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
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
export type FlightBooking = {
  id: number;
  userId: number;
  pilotId: number | null;
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
  };
  pName: string;
  pId: string;
};

// const flightBookings: FlightBooking[] = [];

export function FlightBookingsTableComponent({
  bookings,
  role,
}: {
  bookings: FlightBooking[];
  role: string | undefined;
}) {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const flightBookings = bookings;
  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div className="flex items-center w-full justify-between">
        <h2 className="text-xl m-4   rounded-lg w-fit p-3">Boooking History</h2>
        <Link
          href="/booking/add"
          className="m-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Add Booking
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Flight Date</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Flight Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flightBookings.map(
            (booking, index) => (
              console.log("booking", booking),
              console.log("role", role),
              (
                <Fragment key={booking.id}>
                  <TableRow key={`${index}-row`}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(booking.id)}
                      >
                        {expandedRows[booking.id] ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{format(booking.flightDate, "PPP")}</TableCell>
                    <TableCell>{booking.nationality}</TableCell>
                    <TableCell>{booking.totalPrice}</TableCell>
                    <TableCell>{booking.flightType}</TableCell>
                  </TableRow>
                  {expandedRows[booking.id] && (
                    <TableRow key={`${index}-details`}>
                      <TableCell colSpan={6}>
                        <div className="p-4 bg-muted rounded-md">
                          <h3 className="font-semibold mb-2">
                            Additional Details
                          </h3>
                          <dl className="grid grid-cols-2  gap-x-4 gap-y-2">
                            {role === "ADMIN" && (
                              <>
                                <dt className="font-medium ">
                                  Booking Done by :
                                </dt>
                                <dd>{booking.user.name}</dd>
                              </>
                            )}
                            <dt className="font-medium ">Passenger Name :</dt>
                            <dd>{booking.pName}</dd>
                            <dt className="font-medium">Pilot ID:</dt>
                            <dd>{booking.pilotId ? booking.pilotId : "-"}</dd>
                            <dt className="font-medium">Package :</dt>
                            <dd>{booking.package.title}</dd>
                            <dt className="font-medium">Discount:</dt>
                            <dd>{booking.discount}</dd>
                            <dt className="font-medium">Pre-payment:</dt>
                            <dd>{booking.prePayment}</dd>
                            <dt className="font-medium">Payment Method:</dt>
                            <dd>
                              {booking.paymentMethod
                                ? booking.paymentMethod
                                : "-"}
                            </dd>
                            <dt className="font-medium">
                              Includes Photos/Videos:
                            </dt>
                            <dd>{booking.includes ? "Yes" : "No"}</dd>
                            <dt className="font-medium">Commission NPR:</dt>
                            <dd>Rs. {booking.commissionMin} /-</dd>
                            <dt className="font-medium">Commission USD:</dt>
                            <dd>USD $ {booking.commissionMax}</dd>
                          </dl>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              )
            )
          )}
        </TableBody>
      </Table>
    </>
  );
}
