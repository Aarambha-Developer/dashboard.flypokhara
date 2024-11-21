import { ChangePasswordFormComponent } from "@/components/settings/change-password-form";
import { UpdateDetailForm } from "@/components/settings/update-details-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCookie } from "@/lib/cookie-handler";
import requestHelper from "@/utils/request-helper";
import React from "react";

export default async function ChangePassword() {
  let details: {
    id: number;
    name: string;
    contact: string | undefined;
    about: string | undefined;
  } = { id: 1, name: "", contact: "", about: "" };

  const token = await getCookie("access_token");

  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
    token: token,
    success: (message: string, data: any) => {
      details = data.data;
    },
    failure: (error: any) => {},
  });

  return (
    <div className="flex justify-center items-center mt-20">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <UpdateDetailForm details={details} />
        </TabsContent>
        <TabsContent value="password">
          <ChangePasswordFormComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
