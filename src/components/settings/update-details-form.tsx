"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { deleteCookie, getCookie, setCookie } from "@/lib/cookie-handler";
import requestHelper from "@/utils/request-helper";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string({ message: "Enter full name." }).min(2, {
    message: "Name must be at least 2 characters.",
  }),
  contact: z.string(),
  about: z
    .string()

    .max(500, {
      message: "About section must not exceed 500 characters.",
    }),
});

type FormData = z.infer<typeof formSchema>;

export function UpdateDetailForm({ details }: { details: any }) {
  const [isLoading, setIsLoading] = useState(false);

  //   console.log("details", details);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: details
      ? {
          name: details?.name || "",
          contact: details?.contact || "",
          about: details?.about || "",
        }
      : {
          name: "",
          contact: "",
          about: "",
        },
  });

  const router = useRouter();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const access_token = await getCookie("access_token");
    await requestHelper.patch({
      endPoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile`,
      token: access_token,
      data: data,
      success: async (message: string, data: any) => {
        setIsLoading(false);
        router.refresh();

        window.location.reload();
        toast.success(message);
      },
      failure: (error: any) => {
        setIsLoading(false);
        toast.error(error.message);
        console.log(error);
      },
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Details</CardTitle>
        <CardDescription>Enter your new details to update.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Fly Pokhara" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact </FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About You</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little about yourself..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className=" !bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Updating Details..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
