import { RegisterForm } from "@/components/registration-form";
import { getCookie } from "@/lib/cookie-handler";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import requestHelper from "@/utils/request-helper";
import Link from "next/link";

export default async function RegisterAgency() {
  const role = await getCookie("role");
  const token = await getCookie("access_token");
  let agencys:
    | {
        id: number;
        name: string;
        email: string;
        contact: string;
      }[]
    | undefined;
  await requestHelper.get({
    endPoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/users`,
    token,
    success: (message: string, data: any) => {
      agencys = data.data;
    },
    failure: (error: any) => {},
  });
  return (
    <div>
      {role === "ADMIN" ? (
        <Card className="my-1 mx-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Agencies</CardTitle>
            <Link
              className="bg-primary text-white py-2 px-4 rounded"
              href="/agencies/register"
            >
              Register Agency
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agencys &&
                agencys.map((agency) => (
                  <div key={agency.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {agency.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {agency.email}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{agency.contact}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          <h2 className="flex justify-center items-center text-lg text-red-500 mt-20 uppercase">
            Unauthorized page
          </h2>
        </div>
      )}
    </div>
  );
}
