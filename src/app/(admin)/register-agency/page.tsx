import { RegisterForm } from "@/components/registration-form";
import { getCookie } from "@/lib/cookie-handler";
import React from "react";

export default async function RegisterAgency() {
  const role = await getCookie("role");

  return (
    <div>
      <RegisterForm role={role} />
    </div>
  );
}
