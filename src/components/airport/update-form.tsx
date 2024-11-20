"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import Loading from "../ui/loading";
import { getCookie } from "@/lib/cookie-handler";
import requestHelper from "@/utils/request-helper";
import toast from "react-hot-toast";

const formSchema = z.object({
  pilotId: z.coerce.number({ message: "Select a pilot" }),
  aircraftId: z.coerce.number({ message: "Select an aircraft" }),
});

export type UpdateFormSchema = z.infer<typeof formSchema>;

export default function UpdateForm({
  id,
  pilots,
  aircrafts,
  pilotId,
}: {
  id: number;
  pilots: any;
  aircrafts: any;
  pilotId: number | undefined;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: pilotId
      ? { pilotId: pilotId, aircraftId: undefined }
      : { pilotId: undefined, aircraftId: undefined },
  });

  //   console.log("pilots", pilots);
  //   console.log("aircrafts", aircrafts);

  const onSubmit = async (data: UpdateFormSchema) => {
    // console.log("data", data);
    const token = await getCookie("access_token");

    await requestHelper.patch({
      endPoint: `${process.env.NEXT_PUBLIC_API_URL}/booking/airport/${id}`,
      token: token,
      data: data,
      success: (message: string, data: any) => {
        console.log("data", data);
        toast.success(message);
      },
      failure: (error: any) => {
        console.log("error", error);
        toast.error(error.message);
      },
    });
  };
  //   console.log("pilotId ho hai", pilotId);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" px-8 py-4  rounded-lg w-[100%]  "
        >
          <div className="grid gap-4 pb-4 md:grid-cols-3 ">
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
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please select pilot" />
                        {/* {pilotId
                            ? pilots.find((pilot: any) => pilot.id == pilotId)
                                ?.name
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
              name="aircraftId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-700/80 font-semibold max-md:hidden">
                    Aircraft
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please select aircraft" />
                        {/* {field.value
                            ? aircrafts.find(
                                (aircraft: any) => aircraft.id == field.value
                              )?.aircraftNo
                            : "Please select aircraft"} */}
                        {/* </SelectValue> */}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {aircrafts.map((aircraft: any) => (
                        <div className="flex items-center" key={aircraft.id}>
                          <SelectItem
                            key={aircraft.id}
                            value={aircraft.id.toString()}
                          >
                            {aircraft.aircraftNo}
                          </SelectItem>
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="font-normal" />
                </FormItem>
              )}
            />

            <div className="flex justify-center mx-auto items-center mt-7  my-2">
              <Button className="bg-gray-800 lg:text-base px-14 py-2 transition-all duration-300 hover:scale-105 hover:bg-blue-600">
                {" "}
                Submit &nbsp; {isSubmitting && <Loading />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
