import AdminLayout from "@/components/admin/admin-layout";
import { cookies } from "next/headers";
import React from "react";
import Login from "../(auth)/login/page";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const token = (await cookies()).get("access_token")?.value;

  return token ? <AdminLayout>{children}</AdminLayout> : <Login />;
};

export default RootLayout;
