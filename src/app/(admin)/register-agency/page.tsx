import { RegisterForm } from "@/components/registration-form";
import { getCookie } from "@/lib/cookie-handler";
import React from "react";

export default async function RegisterAgency() {
  const role = await getCookie("role");

  return (
    <div>
      {role === "ADMIN" ? (
        <RegisterForm role={role} />
      ) : (
        <div>
          <h2 className="flex justify-center items-center text-lg text-red-500 mt-20 uppercase">
            Unauthorized page
          </h2>{" "}
        </div>
      )}
    </div>
  );
}
