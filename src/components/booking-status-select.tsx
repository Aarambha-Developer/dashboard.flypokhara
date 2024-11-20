'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type StatusType = 'PENDING' | 'SUCCESS' | 'REFUNDED' | 'CANCELLED';

const statusColors: Record<StatusType, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  SUCCESS: 'bg-green-100 text-green-800',
  REFUNDED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusOptions: { value: StatusType; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUCCESS', label: 'Success' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function BookingStatusSelectComponent({
  bookingId,
  initialStatus = 'PENDING',
  onStatusChange,
  role,
}: {
  bookingId: number;
  initialStatus?: StatusType;
  onStatusChange: (bookingId: number, newStatus: StatusType) => void;
  role: string | undefined;
}) {
  const [value, setValue] = useState<StatusType>(initialStatus);

  useEffect(() => {
    setValue(initialStatus);
  }, [initialStatus]);

  return role === 'ADMIN' ? (
    <Select
      value={value}
      onValueChange={(newValue: StatusType) => {
        setValue(newValue);
        onStatusChange(bookingId, newValue);
      }}>
      <SelectTrigger className={cn('', statusColors[value])}>
        <SelectValue placeholder='Select status' />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status) => (
          <SelectItem
            key={status.value}
            value={status.value}
            className={cn(statusColors[status.value], 'cursor-pointer')}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <div className={cn('px-4 py-2 rounded-md', statusColors[value])}>{initialStatus}</div>
  );
}
