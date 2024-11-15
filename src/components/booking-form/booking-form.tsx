'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import DatePickerWithPresets from '../date/DatePicker';
import { Button } from '../ui/button';
import Loading from '../ui/loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import requestHelper from '@/utils/request-helper';
import toast from 'react-hot-toast';
import { getCookie } from '@/lib/cookie-handler';

const formSchema = z.object({
  flightDate: z.date(),
  nationality: z.string({ message: 'Nationality is required' }),
  prePayment: z.coerce.number(),
  discount: z.coerce.number(),
  flightType: z
    .enum(['FREE', 'TRAINING', 'COMMERCIAL', 'TEST'], {
      errorMap: () => ({ message: 'Please select a flight type.' }),
    })
    .nullable(),
  paymentMethod: z.any(),

  packageId: z.coerce.number(),
  pilotId: z.any(),
  includes: z.boolean(),
  commission: z.coerce.number(),
  pName: z
    .string({ message: 'Full Name is required' })
    .min(2, { message: ' Name must be at least 2 characters' }),
  pId: z.string(),
  // ticketNo: z.string({ message: 'Ticket number is required' })(),
  ticketNo: z.any(),
  pIdType: z.string({ message: 'Identification type is required' }),

  aircraftType: z.enum(['OPEN', 'CLOSE'], {
    errorMap: () => ({ message: 'Please select a aircraft type.' }),
  }),
});

export type BookingFormSchema = z.infer<typeof formSchema>;

export default function BookingForm({
  role,
  pilots,
  flightPackages,
}: {
  role: string;
  pilots: any;
  flightPackages: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const aircraftType = [
    { value: 'OPEN', label: 'Open' },
    { value: 'CLOSE', label: 'Close' },
  ];

  const paymentType = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CARD', label: 'Card' },
    { value: 'CREDIT', label: 'Credit' },
    { value: 'ONLINE', label: 'Online' },
  ];

  const flightType = [
    { value: 'FREE', label: 'Free Flight' },
    { value: 'TRAINING', label: 'Training Flight' },
    { value: 'COMMERCIAL', label: 'Commercial Flight' },
    { value: 'TEST', label: 'Test Flight' },
  ];

  const form = useForm<BookingFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flightDate: new Date(),
      nationality: '',
      prePayment: 0,
      discount: 0,
      flightType: 'COMMERCIAL',
      paymentMethod: undefined,
      packageId: undefined,
      pilotId: undefined,
      includes: false,
      commission: 0,
      pName: '',
      pId: '',
      ticketNo: '',
      pIdType: '',
      aircraftType: undefined,
    },
  });

  console.log(flightPackages, 'flight packages ...........');
  const onSubmit = async (data: BookingFormSchema) => {
    const access_token = await getCookie('access_token');
    console.log(data);
    await requestHelper.post({
      endPoint: `${process.env.NEXT_PUBLIC_API_URL}/booking`,
      data: {
        ...data,
        pilotId: form.getValues('pilotId')
          ? Number(form.getValues('pilotId'))
          : undefined,
      },
      token: access_token,
      success: (message: string, data: any) => {
        // console.log("success", data);
        toast.success(message);
        form.reset();
      },
      failure: (error: any) => {
        console.log('error', error);
        toast.error(error.message);
      },
    });
  };

  return (
    <>
      <div className='max-w-6xl mx-auto bg-white rounded-lg pt-4  mt-20 '>
        <div className='flex justify-center'>
          <h2 className='font-medium text-3xl text-gray-800'>Booking Form</h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='my-8 p-8  rounded-lg w-[100%] '>
            {/* name and nationality */}
            <div className='grid gap-4 pb-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='pName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                      Full Name <span className='text-red-600 text-lg'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Passenger Full Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='nationality'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                      Nationality{' '}
                      <span className='text-red-600 text-lg'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Nationlaity' {...field} />
                    </FormControl>
                    <FormMessage className='font-normal' />
                  </FormItem>
                )}
              />
            </div>

            {/* identidication type and number */}
            <div className='grid gap-4 pb-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='pIdType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                      Identification Type{' '}
                      <span className='text-red-600 text-lg'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Citizenship / Passport' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='pId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                      Identification Number
                      <span className='text-red-600 text-lg'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Citizenship ID / Passport ID'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='font-normal' />
                  </FormItem>
                )}
              />
            </div>

            {/* flight date and aircraft type */}
            <div className='grid gap-4 pb-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='flightDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                      Flight Date{' '}
                      <span className='text-red-600 text-lg'>*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePickerWithPresets
                        date={
                          field.value instanceof Date
                            ? field.value
                            : new Date(field.value)
                        }
                        setDate={(date: Date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='aircraftType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                      Aircraft Type{' '}
                      <span className='text-red-600 text-lg'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Please select aircraft type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {aircraftType.map((aircraft) => (
                          <div
                            className='flex items-center'
                            key={aircraft.value}>
                            <SelectItem
                              key={aircraft.value}
                              value={aircraft.value}
                              //   className="uppercase"
                            >
                              {aircraft.label}
                            </SelectItem>
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='font-normal' />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid gap-4 pb-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='packageId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                      Flight Packages
                      <span className='text-red-600 text-lg'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Please select flight package'>
                            {field.value
                              ? flightPackages.find(
                                  (flight: any) => flight.id == field.value
                                )?.title
                              : 'Please select flight package'}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {flightPackages.map((flight: any) => (
                          <SelectItem
                            key={flight.id}
                            value={flight.id}
                            //   className="uppercase"
                          >
                            {flight.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='font-normal' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='includes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                      Want Photos / Videos?{' '}
                      <span className='text-red-600 text-lg'>*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === 'true')
                        }
                        className='flex'>
                        <FormItem className='flex items-center space-x-2 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='true' />
                          </FormControl>
                          <FormLabel className='font-normal'>Yes</FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center space-x-2 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='false' />
                          </FormControl>
                          <FormLabel className='font-normal'>No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* only for admin */}
            {/* prepayment and payment type */}
            {role === 'ADMIN' && (
              <div>
                <div className='grid gap-4 pb-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='prePayment'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                          Pre Payment{' '}
                          <span className='text-red-600 text-lg'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Pre Payment' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='paymentMethod'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                          Payment Method{' '}
                          <span className='text-red-600 text-lg'>*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Please select payment method' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {paymentType.map((payment) => (
                              <div
                                className='flex items-center'
                                key={payment.value}>
                                <SelectItem
                                  key={payment.value}
                                  value={payment.value}
                                  //   className="uppercase"
                                >
                                  {payment.label}
                                </SelectItem>
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className='font-normal' />
                      </FormItem>
                    )}
                  />
                </div>

                {/* pilot and ticket no */}
                <div className='grid gap-4 pb-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='pilotId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                          Pilot <span className='text-red-600 text-lg'>*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Please select pilot'>
                                {field.value
                                  ? pilots.find(
                                      (pilot: any) => pilot.id == field.value
                                    )?.name
                                  : 'Please select pilot'}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pilots.map((pilot: any) => (
                              <div className='flex items-center' key={pilot.id}>
                                <SelectItem
                                  key={pilot.id}
                                  value={pilot.id}
                                  //   className="uppercase"
                                >
                                  {pilot.name}
                                </SelectItem>
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className='font-normal' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='ticketNo'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                          Ticket No{' '}
                          <span className='text-red-600 text-lg'>*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Ticket No' {...field} />
                        </FormControl>
                        <FormMessage className='font-normal' />
                      </FormItem>
                    )}
                  />
                </div>
                {/* discount and commision */}
                <div className='grid gap-4 pb-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='discount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                          Discount
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Discount' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='flightType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-blue-700/80 font-semibold max-md:hidden'>
                          Flight Type
                          <span className='text-red-600 text-lg'>*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Please select flight type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {flightType.map((flight) => (
                              <div
                                className='flex items-center'
                                key={flight.value}>
                                <SelectItem
                                  key={flight.value}
                                  value={flight.value}
                                  //   className="uppercase"
                                >
                                  {flight.label}
                                </SelectItem>
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className='font-normal' />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="commission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                          Commission (%)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Commission" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
              </div>
            )}

            <div className='flex justify-center mx-auto items-center  my-4'>
              <Button className='bg-blue-500 lg:text-base px-14 py-2 transition-all duration-300 hover:scale-105 hover:bg-blue-600'>
                {' '}
                Submit &nbsp; {isSubmitting && <Loading />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
