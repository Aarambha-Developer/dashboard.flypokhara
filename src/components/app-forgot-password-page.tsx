"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "./ui/card";
import requestHelper from "@/utils/request-helper";
import { deleteCookie } from "@/lib/cookie-handler";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export function BlockPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Here you would typically call your API to handle the password reset
      // For this example, we'll just simulate a successful request
      await requestHelper.post({
        endPoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        data: data,
        success: async (message: string, data: any) => {
          setIsLoading(false);
          toast.success(message);
        },
        failure: (error: any) => {
          setIsLoading(false);
          toast.error(error.message);
          console.log(error);
        },
      });
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <Card className="container mx-auto max-w-md py-10 mt-20">
      <CardContent>
        <h1 className="text-2xl font-bold mb-1">Forgot Password</h1>
        <p className="text-sm my-2 text-muted-foreground">
          You will receive a link in your mail. Click on the link to reset
          password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-sm text-red-500" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Reset Password"}
          </Button>
        </form>
        {message && (
          <p className="mt-4 text-sm text-green-600" role="alert">
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
