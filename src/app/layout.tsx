import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AdminLayout from "@/components/admin/admin-layout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Login from "./(auth)/login/page";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fly Pokhara",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("access_token")?.value;
  const role = (await cookies()).get("role")?.value;

  // Redirect based on authentication and role
  // if (!token) {
  //   redirect("/login");
  // } else if (role !== "admin") {
  //   redirect("/");
  // }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* <AdminLayout>{children}</AdminLayout> */}
      </body>
    </html>
  );
}
