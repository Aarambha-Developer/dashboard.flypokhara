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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { useRouter } from "next/navigation";
import { PaginationWithLinks } from "./ui/pagination-with-links";
export type FlightBooking = {
  id: number;
  userId: number;
  pilot: {
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
  };
  pName: string;
  pId: string;
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
}: {
  bookings: FlightBooking[];
  role: string | undefined;
  meta: meta;
}) {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const flightBookings = bookings;
  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  // console.log("searchParams", params);

  const [currentPage, setCurrentPage] = useState(meta.page);
  const [perPage, setPerPage] = useState(10);

  console.log("meta", meta);

  return (
    <>
      <div className="flex items-center w-full justify-between">
        <h2 className="text-xl m-4   rounded-lg w-fit p-3">Boooking History</h2>
        <Link
          href="/booking/add"
          className="m-4 px-4 py-2 bg-gray-800 text-white rounded-sm"
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
            <TableHead>Country</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Flight Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flightBookings.map((booking, index) => (
            // console.log("booking", booking),
            // console.log("role", role),
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
                <TableCell>
                  {booking.nationality
                    ?.split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")}
                </TableCell>
                <TableCell>{booking.totalPrice}</TableCell>
                <TableCell>{booking.flightType}</TableCell>
              </TableRow>
              {expandedRows[booking.id] && (
                <TableRow key={`${index}-details`}>
                  <TableCell colSpan={6}>
                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-semibold mb-2">Booking Details</h3>
                      <dl className="grid grid-cols-2  gap-x-4 gap-y-2">
                        {role === "ADMIN" && (
                          <>
                            <dt className="font-medium ">Booking Done by :</dt>
                            <dd>{booking.user.name}</dd>
                          </>
                        )}
                        <dt className="font-medium ">Passenger Name :</dt>
                        <dd>{booking.pName}</dd>
                        <dt className="font-medium">Pilot Name:</dt>
                        <dd>
                          {booking.pilot?.name ? booking.pilot?.name : "-"}
                        </dd>
                        <dt className="font-medium">Package :</dt>
                        <dd>{booking.package.title}</dd>
                        <dt className="font-medium">Discount:</dt>
                        <dd>{booking.discount}</dd>
                        <dt className="font-medium">Pre-payment:</dt>
                        <dd>{booking.prePayment}</dd>
                        <dt className="font-medium">Payment Method:</dt>
                        <dd>
                          {booking.paymentMethod ? booking.paymentMethod : "-"}
                        </dd>
                        <dt className="font-medium">Includes Photos/Videos:</dt>
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
          ))}
        </TableBody>
      </Table>

      <PaginationWithLinks
        page={meta.page}
        pageSize={perPage}
        totalCount={meta.total}
      />
    </>
  );
}
