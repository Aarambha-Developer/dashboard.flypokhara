"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { date, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import DatePickerWithPresets from "../date/DatePicker";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const formSchema = z.object({
  flightDate: z.date(),
  pName: z
    .string({ message: "Full Name is required" })
    .min(2, { message: " Name must be at least 2 characters" }),
  pNationality: z.string({ message: "Nationality is required" }),
  pPassport: z.string({ message: "Passport No is required" }),
  flightDuraion: z.string(),
  ticketNo: z.string(),
  aircraftType: z.enum(["OPEN", "CLOSE"], {
    errorMap: () => ({ message: "Please select a aircraft type." }),
  }),
  photo: z.boolean(),
  pilot: z.string(),
  prePayment: z.string(),
  paymentType: z.enum(["CASH", "CARD", "CREDIT", "ONLINE"], {
    errorMap: () => ({ message: "Please select a valid payment type." }),
  }),
  flightType: z.enum(["FREE", "TRAINING", "COMMERCIAL", "TEST"], {
    errorMap: () => ({ message: "Please select a flight type." }),
  }),
});

export type BookingFormSchema = z.infer<typeof formSchema>;

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const aircraftType = [
    { value: "OPEN", label: "Open" },
    { value: "CLOSE", label: "Close" },
  ];

  const paymentType = [
    { value: "CASH", label: "Cash" },
    { value: "CARD", label: "Card" },
    { value: "CREDIT", label: "Credit" },
    { value: "ONLINE", label: "Online" },
  ];

  const flightType = [
    { value: "FREE", label: "Free Flight" },
    { value: "TRAINING", label: "Training Flight" },
    { value: "COMMERCIAL", label: "Commercial Flight" },
    { value: "TEST", label: "Test Flight" },
  ];

  const form = useForm<BookingFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flightDate: new Date(),
      pName: "",
      pNationality: "",
      pPassport: "",
      flightDuraion: "",
      ticketNo: "",
      aircraftType: undefined,
      photo: undefined,
      pilot: "",
      prePayment: "",
      paymentType: undefined,
      flightType: undefined,
    },
  });

  const onSubmit = (data: BookingFormSchema) => {
    console.log("Booking form submitted:", data);
  };

  return (
    <>
      <div className="w-full mt-20 ">
        <div className="flex justify-center">
          <h2 className="font-medium text-3xl text-gray-800">Booking Form</h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="my-8 p-6 border border-x-gray-600 rounded-lg w-[100%] "
          >
            <div className="grid gap-4 pb-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="pName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Full Name <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Passenger Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pNationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Nationality{" "}
                      <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nationlaity" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 pb-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="flightDuraion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Flight Duration (Package){" "}
                      <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select flight type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {flightType.map((flight) => (
                          <div className="flex items-center" key={flight.value}>
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
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flightDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Flight Date
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
            </div>
            <div className="grid gap-4 pb-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="pPassport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Passport Num{" "}
                      <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Passport Num" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 pb-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="pilot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Pilot
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Pilot" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aircraftType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Aircraft Type{" "}
                      <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select aircraft type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {aircraftType.map((aircraft) => (
                          <div
                            className="flex items-center"
                            key={aircraft.value}
                          >
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
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 pb-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="prePayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Pre Payment
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Pre Payment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Payment Type{" "}
                      <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select payment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentType.map((payment) => (
                          <div
                            className="flex items-center"
                            key={payment.value}
                          >
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
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 pb-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Photo <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        className="flex"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="true" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="false" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ticketNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#4b5c5f] max-md:hidden">
                      Tciket No <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ticket No" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center md:justify-end">
              <Button className="bg-blue-500 px-8 py-1 transition-all duration-300 hover:scale-105 hover:bg-blue-600">
                {" "}
                Submit &nbsp; {isSubmitting && <Loading />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
