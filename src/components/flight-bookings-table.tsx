"use client";

import { useState } from "react";
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

type FlightBooking = {
  id: number;
  userId: number;
  pilotId: number;
  flightDate: string;
  packageId: number;
  nationality: string;
  totalPrice: number;
  discount: number;
  prePayment: number;
  flightType: string;
  paymentMethod: string;
  includes: boolean;
  commission: number;
};

const flightBookings: FlightBooking[] = [
  {
    id: 2,
    userId: 5,
    pilotId: 3,
    flightDate: "2023-01-01",
    packageId: 3,
    nationality: "nepali",
    totalPrice: 20000,
    discount: 100,
    prePayment: 200,
    flightType: "COMMERICAL",
    paymentMethod: "CASH",
    includes: true,
    commission: 2000,
  },
  {
    id: 3,
    userId: 5,
    pilotId: 3,
    flightDate: "2023-01-01",
    packageId: 3,
    nationality: "nepali",
    totalPrice: 20000,
    discount: 100,
    prePayment: 200,
    flightType: "COMMERICAL",
    paymentMethod: "CASH",
    includes: true,
    commission: 2000,
  },
  {
    id: 4,
    userId: 5,
    pilotId: 3,
    flightDate: "2023-01-01",
    packageId: 3,
    nationality: "nepali",
    totalPrice: 20000,
    discount: 100,
    prePayment: 200,
    flightType: "COMMERICAL",
    paymentMethod: "CASH",
    includes: true,
    commission: 2000,
  },
  {
    id: 5,
    userId: 5,
    pilotId: 3,
    flightDate: "2023-01-01",
    packageId: 3,
    nationality: "nepali",
    totalPrice: 20000,
    discount: 100,
    prePayment: 200,
    flightType: "COMMERICAL",
    paymentMethod: "CASH",
    includes: true,
    commission: 2000,
  },
  {
    id: 15,
    userId: 5,
    pilotId: 3,
    flightDate: "2023-01-01",
    packageId: 3,
    nationality: "nepali",
    totalPrice: 20000,
    discount: 100,
    prePayment: 200,
    flightType: "COMMERICAL",
    paymentMethod: "CASH",
    includes: true,
    commission: 2000,
  },
  {
    id: 15,
    userId: 5,
    pilotId: 3,
    flightDate: "2023-01-01",
    packageId: 3,
    nationality: "nepali",
    totalPrice: 20000,
    discount: 100,
    prePayment: 200,
    flightType: "COMMERICAL",
    paymentMethod: "CASH",
    includes: true,
    commission: 2000,
  },
];

export function FlightBookingsTableComponent() {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
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
        {flightBookings.map((booking, index) => (
          <>
            <TableRow key={index}>
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
              <TableCell>{booking.flightDate}</TableCell>
              <TableCell>{booking.nationality}</TableCell>
              <TableCell>{booking.totalPrice}</TableCell>
              <TableCell>{booking.flightType}</TableCell>
            </TableRow>
            {expandedRows[booking.id] && (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="p-4 bg-muted rounded-md">
                    <h3 className="font-semibold mb-2">Additional Details</h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <dt className="font-medium">User ID:</dt>
                      <dd>{booking.userId}</dd>
                      <dt className="font-medium">Pilot ID:</dt>
                      <dd>{booking.pilotId}</dd>
                      <dt className="font-medium">Package ID:</dt>
                      <dd>{booking.packageId}</dd>
                      <dt className="font-medium">Discount:</dt>
                      <dd>{booking.discount}</dd>
                      <dt className="font-medium">Pre-payment:</dt>
                      <dd>{booking.prePayment}</dd>
                      <dt className="font-medium">Payment Method:</dt>
                      <dd>{booking.paymentMethod}</dd>
                      <dt className="font-medium">Includes:</dt>
                      <dd>{booking.includes ? "Yes" : "No"}</dd>
                      <dt className="font-medium">Commission:</dt>
                      <dd>{booking.commission}</dd>
                    </dl>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  );
}
