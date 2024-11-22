"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { z } from "zod";
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
import requestHelper from "@/utils/request-helper";
import toast from "react-hot-toast";
import { getCookie } from "@/lib/cookie-handler";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  flightDate: z.date(),
  nationality: z.string({ message: "Country is required" }),
  prePayment: z.coerce.number({ message: "Invalid Prepayment amount" }),
  discount: z.coerce.number({ message: "Invalid Discount amount" }),
  flightType: z
    .enum(["FREE", "TRAINING", "COMMERCIAL", "TEST"], {
      errorMap: () => ({ message: "Please select a flight type." }),
    })
    .nullable(),
  paymentMethod: z.any(),

  packageId: z.coerce.number({ message: "Flight Package is required" }),
  pilotId: z.any(),
  includes: z.boolean(),
  // commission: z.coerce.number().nullable(),
  pName: z
    .string({ message: "Full Name is required" })
    .min(2, { message: " Name must be at least 2 characters" }),
  pId: z.string({ message: "Identification number is required" }),
  // ticketNo: z.string({ message: 'Ticket number is required' })(),
  ticketNo: z.any(),
  pIdType: z.string({ message: "Identification type is required" }),

  aircraftType: z.enum(["OPEN", "CLOSE"], {
    errorMap: () => ({ message: "Please select a aircraft type." }),
  }),
});

export type BookingFormSchema = z.infer<typeof formSchema>;

export default function BookingForm({
  role,
  pilots,
  flightPackages,
  bookingDetails,
}: {
  role: string;
  pilots: any;
  flightPackages: any;
  bookingDetails: (BookingFormSchema & { id: number | undefined }) | undefined;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  // console.log("packages", flightPackages);

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

  const nationalities = [
    { name: "Afghanistan", code: "AF" },
    { name: "Åland Islands", code: "AX" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "American Samoa", code: "AS" },
    { name: "AndorrA", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Anguilla", code: "AI" },
    { name: "Antarctica", code: "AQ" },
    { name: "Antigua and Barbuda", code: "AG" },
    { name: "Argentina", code: "AR" },
    { name: "Armenia", code: "AM" },
    { name: "Aruba", code: "AW" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahamas", code: "BS" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Barbados", code: "BB" },
    { name: "Belarus", code: "BY" },
    { name: "Belgium", code: "BE" },
    { name: "Belize", code: "BZ" },
    { name: "Benin", code: "BJ" },
    { name: "Bermuda", code: "BM" },
    { name: "Bhutan", code: "BT" },
    { name: "Bolivia", code: "BO" },
    { name: "Bosnia and Herzegovina", code: "BA" },
    { name: "Botswana", code: "BW" },
    { name: "Bouvet Island", code: "BV" },
    { name: "Brazil", code: "BR" },
    { name: "British Indian Ocean Territory", code: "IO" },
    { name: "Brunei Darussalam", code: "BN" },
    { name: "Bulgaria", code: "BG" },
    { name: "Burkina Faso", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cambodia", code: "KH" },
    { name: "Cameroon", code: "CM" },
    { name: "Canada", code: "CA" },
    { name: "Cape Verde", code: "CV" },
    { name: "Cayman Islands", code: "KY" },
    { name: "Central African Republic", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Christmas Island", code: "CX" },
    { name: "Cocos (Keeling) Islands", code: "CC" },
    { name: "Colombia", code: "CO" },
    { name: "Comoros", code: "KM" },
    { name: "Congo", code: "CG" },
    { name: "Congo, The Democratic Republic of the", code: "CD" },
    { name: "Cook Islands", code: "CK" },
    { name: "Costa Rica", code: "CR" },
    { name: "Cote D'Ivoire", code: "CI" },
    { name: "Croatia", code: "HR" },
    { name: "Cuba", code: "CU" },
    { name: "Cyprus", code: "CY" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Denmark", code: "DK" },
    { name: "Djibouti", code: "DJ" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic", code: "DO" },
    { name: "Ecuador", code: "EC" },
    { name: "Egypt", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Estonia", code: "EE" },
    { name: "Ethiopia", code: "ET" },
    { name: "Falkland Islands (Malvinas)", code: "FK" },
    { name: "Faroe Islands", code: "FO" },
    { name: "Fiji", code: "FJ" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "French Guiana", code: "GF" },
    { name: "French Polynesia", code: "PF" },
    { name: "French Southern Territories", code: "TF" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia", code: "GM" },
    { name: "Georgia", code: "GE" },
    { name: "Germany", code: "DE" },
    { name: "Ghana", code: "GH" },
    { name: "Gibraltar", code: "GI" },
    { name: "Greece", code: "GR" },
    { name: "Greenland", code: "GL" },
    { name: "Grenada", code: "GD" },
    { name: "Guadeloupe", code: "GP" },
    { name: "Guam", code: "GU" },
    { name: "Guatemala", code: "GT" },
    { name: "Guernsey", code: "GG" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Guyana", code: "GY" },
    { name: "Haiti", code: "HT" },
    { name: "Heard Island and Mcdonald Islands", code: "HM" },
    { name: "Holy See (Vatican City State)", code: "VA" },
    { name: "Honduras", code: "HN" },
    { name: "Hong Kong", code: "HK" },
    { name: "Hungary", code: "HU" },
    { name: "Iceland", code: "IS" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran, Islamic Republic Of", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Ireland", code: "IE" },
    { name: "Isle of Man", code: "IM" },
    { name: "Israel", code: "IL" },
    { name: "Italy", code: "IT" },
    { name: "Jamaica", code: "JM" },
    { name: "Japan", code: "JP" },
    { name: "Jersey", code: "JE" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kenya", code: "KE" },
    { name: "Kiribati", code: "KI" },
    { name: "Korea, Democratic People'S Republic of", code: "KP" },
    { name: "Korea, Republic of", code: "KR" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: "Lao People'S Democratic Republic", code: "LA" },
    { name: "Latvia", code: "LV" },
    { name: "Lebanon", code: "LB" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libyan Arab Jamahiriya", code: "LY" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Macao", code: "MO" },
    { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mali", code: "ML" },
    { name: "Malta", code: "MT" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Martinique", code: "MQ" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Mayotte", code: "YT" },
    { name: "Mexico", code: "MX" },
    { name: "Micronesia, Federated States of", code: "FM" },
    { name: "Moldova, Republic of", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Mongolia", code: "MN" },
    { name: "Montserrat", code: "MS" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Myanmar", code: "MM" },
    { name: "Namibia", code: "NA" },
    { name: "Nauru", code: "NR" },
    { name: "Nepal", code: "NP" },
    { name: "Netherlands", code: "NL" },
    { name: "Netherlands Antilles", code: "AN" },
    { name: "New Caledonia", code: "NC" },
    { name: "New Zealand", code: "NZ" },
    { name: "Nicaragua", code: "NI" },
    { name: "Niger", code: "NE" },
    { name: "Nigeria", code: "NG" },
    { name: "Niue", code: "NU" },
    { name: "Norfolk Island", code: "NF" },
    { name: "Northern Mariana Islands", code: "MP" },
    { name: "Norway", code: "NO" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palau", code: "PW" },
    { name: "Palestinian Territory, Occupied", code: "PS" },
    { name: "Panama", code: "PA" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Philippines", code: "PH" },
    { name: "Pitcairn", code: "PN" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Puerto Rico", code: "PR" },
    { name: "Qatar", code: "QA" },
    { name: "Reunion", code: "RE" },
    { name: "Romania", code: "RO" },
    { name: "Russian Federation", code: "RU" },
    { name: "RWANDA", code: "RW" },
    { name: "Saint Helena", code: "SH" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Pierre and Miquelon", code: "PM" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Samoa", code: "WS" },
    { name: "San Marino", code: "SM" },
    { name: "Sao Tome and Principe", code: "ST" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Senegal", code: "SN" },
    { name: "Serbia and Montenegro", code: "CS" },
    { name: "Seychelles", code: "SC" },
    { name: "Sierra Leone", code: "SL" },
    { name: "Singapore", code: "SG" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Somalia", code: "SO" },
    { name: "South Africa", code: "ZA" },
    { name: "South Georgia and the South Sandwich Islands", code: "GS" },
    { name: "Spain", code: "ES" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Sudan", code: "SD" },
    { name: "Suriname", code: "SR" },
    { name: "Svalbard and Jan Mayen", code: "SJ" },
    { name: "Swaziland", code: "SZ" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Syrian Arab Republic", code: "SY" },
    { name: "Taiwan, Province of China", code: "TW" },
    { name: "Tajikistan", code: "TJ" },
    { name: "Tanzania, United Republic of", code: "TZ" },
    { name: "Thailand", code: "TH" },
    { name: "Timor-Leste", code: "TL" },
    { name: "Togo", code: "TG" },
    { name: "Tokelau", code: "TK" },
    { name: "Tonga", code: "TO" },
    { name: "Trinidad and Tobago", code: "TT" },
    { name: "Tunisia", code: "TN" },
    { name: "Turkey", code: "TR" },
    { name: "Turkmenistan", code: "TM" },
    { name: "Turks and Caicos Islands", code: "TC" },
    { name: "Tuvalu", code: "TV" },
    { name: "Uganda", code: "UG" },
    { name: "Ukraine", code: "UA" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom", code: "GB" },
    { name: "United States", code: "US" },
    { name: "United States Minor Outlying Islands", code: "UM" },
    { name: "Uruguay", code: "UY" },
    { name: "Uzbekistan", code: "UZ" },
    { name: "Vanuatu", code: "VU" },
    { name: "Venezuela", code: "VE" },
    { name: "Viet Nam", code: "VN" },
    { name: "Virgin Islands, British", code: "VG" },
    { name: "Virgin Islands, U.S.", code: "VI" },
    { name: "Wallis and Futuna", code: "WF" },
    { name: "Western Sahara", code: "EH" },
    { name: "Yemen", code: "YE" },
    { name: "Zambia", code: "ZM" },
    { name: "Zimbabwe", code: "ZW" },
  ];

  const form = useForm<BookingFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: bookingDetails
      ? bookingDetails
      : {
          flightDate: new Date(),
          nationality: undefined,
          prePayment: 0,
          discount: 0,
          flightType: "COMMERCIAL",
          paymentMethod: undefined,
          packageId: undefined,
          pilotId: undefined,
          includes: false,
          pName: "",
          pId: undefined,
          ticketNo: "",
          pIdType: undefined,
          aircraftType: undefined,
        },
  });

  const onSubmit = async (data: BookingFormSchema) => {
    console.log("payload", data);
    const access_token = await getCookie("access_token");
    !bookingDetails
      ? await requestHelper.post({
          endPoint: `${process.env.NEXT_PUBLIC_API_URL}/booking`,
          data:
            role == "ADMIN"
              ? {
                  ...data,
                  pilotId: form.getValues("pilotId")
                    ? Number(form.getValues("pilotId"))
                    : undefined,
                }
              : {
                  pName: form.getValues("pName"),
                  nationality: form.getValues("nationality"),
                  pId: form.getValues("pId"),
                  pIdType: form.getValues("pIdType"),
                  flightDate: form.getValues("flightDate"),
                  packageId: Number(form.getValues("packageId")),
                  includes: form.getValues("includes"),
                  aircraftType: form.getValues("aircraftType"),
                },
          token: access_token,
          success: (message: string, data: any) => {
            toast.success(message);
            form.reset();
            router.push("/booking");
          },
          failure: (error: any) => {
            toast.error(error.message);
          },
        })
      : await requestHelper.patch({
          endPoint: `${process.env.NEXT_PUBLIC_API_URL}/booking/${bookingDetails?.id}`,

          data:
            role == "ADMIN"
              ? {
                  ...data,
                  pilotId: form.getValues("pilotId")
                    ? Number(form.getValues("pilotId"))
                    : undefined,
                }
              : {
                  pName: form.getValues("pName"),
                  nationality: form.getValues("nationality"),
                  pId: form.getValues("pId"),
                  pIdType: form.getValues("pIdType"),
                  flightDate: form.getValues("flightDate"),
                  packageId: Number(form.getValues("packageId")),
                  paymentMethod: form.getValues("paymentMethod") || undefined,
                  includes: form.getValues("includes"),
                  aircraftType: form.getValues("aircraftType"),
                },
          token: access_token,
          success: (message: string, data: any) => {
            toast.success(message);
            form.reset();
            router.push("/booking");
          },
          failure: (error: any) => {
            toast.error(error.message);
          },
        });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white rounded-lg pt-4  mt-4 ">
        <div className="flex justify-center">
          <h2 className="font-medium text-2xl text-gray-800">Booking Form</h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" px-8 py-4  rounded-lg w-[100%] "
          >
            {/* name and nationality */}
            <div className="grid gap-4 pb-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="pName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                      Full Name <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Passenger Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                      Country <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Please select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nationalities.map((nationality) => (
                          <div
                            className="flex items-center"
                            key={nationality.name}
                          >
                            <SelectItem
                              key={nationality.name}
                              value={nationality.name.toLowerCase()}
                              //   className="uppercase"
                            >
                              {nationality.name}
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

            {/* identidication type and number */}
            <div className="grid gap-4 pb-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="pIdType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                      Identification Type{" "}
                      <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Citizenship / Passport"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                      Identification Number
                      <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Citizenship ID / Passport ID"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
            </div>

            {/* flight date and aircraft type */}
            <div className="grid gap-4 pb-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="flightDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                      Flight Date{" "}
                      <span className="text-red-600 text-lg">*</span>
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
                name="aircraftType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                      Aircraft Type{" "}
                      <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            // defaultValue={field.value}
                            placeholder={
                              field.value
                                ? field.value
                                : "Please select aircraft type"
                            }
                          />
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
                name="packageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                      Flight Packages
                      <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ? field.value.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            // placeholder={
                            //   field.value
                            //     ? flightPackages.find(
                            //         (flight: any) => flight.id == field.value
                            //       )?.title
                            //     : "Please select flight package"
                            // }
                            placeholder={"Please select a flight package"}
                          />
                          {/* {field.value
                              ? `${
                                  flightPackages.find(
                                    (flight: any) => flight.id == field.value
                                  )?.title
                                } (${
                                  flightPackages.find(
                                    (flight: any) => flight.id == field.value
                                  )?.duration
                                } minutes)`
                              : "Please select flight package"} */}
                          {/* </SelectValue> */}
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {flightPackages.map((flight: any) => (
                          <SelectItem
                            key={flight.id}
                            value={flight.id.toString()}
                            //   className="uppercase"
                          >
                            {flight.title} &nbsp;
                            <span className="font-[600]">
                              {" "}
                              ({flight.duration} minutes)
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="font-normal" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                      Want Photos / Videos?{" "}
                      <span className="text-red-600 text-lg">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={field.value ? "true" : "false"}
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
            </div>

            {/* only for admin */}
            {/* prepayment and payment type */}
            {role === "ADMIN" && (
              <div>
                <div className="grid gap-4 pb-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="prePayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                          Pre Payment &nbsp;
                          {form.getValues("nationality") === "Nepal" ||
                          form.getValues("nationality") === "India"
                            ? "(Rs.)"
                            : "(USD)"}
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
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                          Payment Method{" "}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Please select payment method" />
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

                {/* pilot and ticket no */}
                <div className="grid gap-4 pb-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="pilotId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                          Pilot
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={
                            field.value ? field.value.toString() : ""
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Please select pilot" />
                              {/* {field.value
                                  ? pilots.find(
                                      (pilot: any) => pilot.id == field.value
                                    )?.name
                                  : "Please select pilot"} */}
                              {/* </SelectValue> */}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pilots.map((pilot: any) => (
                              <div className="flex items-center" key={pilot.id}>
                                <SelectItem
                                  key={pilot.id}
                                  value={pilot.id.toString()}
                                  //   className="uppercase"
                                >
                                  {pilot.name}
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
                    name="ticketNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                          Ticket No{" "}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Ticket No" {...field} />
                        </FormControl>
                        <FormMessage className="font-normal" />
                      </FormItem>
                    )}
                  />
                </div>
                {/* discount and commision */}
                <div className="grid gap-4 pb-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                          Discount &nbsp;
                          {form.getValues("nationality") === "Nepal" ||
                          form.getValues("nationality") === "India"
                            ? "(Rs.)"
                            : "(USD)"}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Discount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="flightType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                          Flight Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Please select flight type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {flightType.map((flight) => (
                              <div
                                className="flex items-center"
                                key={flight.value}
                              >
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

            <div className="flex justify-center mx-auto items-center  my-2">
              <Button className="bg-blue-500 lg:text-base px-14 py-2 transition-all duration-300 hover:scale-105 hover:bg-blue-600">
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
