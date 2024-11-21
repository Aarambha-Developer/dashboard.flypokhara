"use client";
import {
  deleteAllCookies,
  deleteCookie,
  getCookie,
} from "@/lib/cookie-handler";
import routes from "@/Routes/routes";
import requestHelper from "@/utils/request-helper";
import { BarChart3, Users, Package, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  type details =
    | {
        id: number;
        name: string;
        contact: string | undefined;
        about: string | undefined;
      }
    | undefined;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [details, setDetails] = useState<details>(undefined);

  // const [isAdmin, setIsAdmin] = useState<string | undefined>(undefined);
  // const [user, setUser] = useState<string | undefined>(undefined);
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getCookie("role");
      // const user = await getCookie("user");
      const token = await getCookie("access_token");

      await requestHelper.get({
        endPoint: `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        token: token,
        success: (message: string, data: any) => {
          setDetails(data.data);
        },
        failure: (error: any) => {},
      });

      setRole(role);
      // setIsAdmin(role);
      // setUser(details?.name);
    };
    fetchRole();
  }, []);

  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <nav>
          {routes
            .filter((route) => route.role.includes(role || "")) // Filter routes based on the user's role
            .map((route) => (
              <Link
                key={route.id} // Use route.id instead of index
                href={route.href}
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
              >
                <BarChart3 className="inline-block mr-2" size={20} />
                {route.name}
              </Link>
            ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-gray-200">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none md:hidden"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="text-xl font-semibold text-gray-800 ml-4">
              Welcome {details?.name} !
            </h2>
          </div>
          <div className="flex items-center">
            <button
              onClick={async () => {
                await deleteCookie("access_token");
                await deleteCookie("role");
                await deleteCookie("user");
                router.push("/login");
              }}
              className="flex items-center justify-center bg-gray-800 text-white font-medium hover:border border-gray-800 border transition-all   hover:bg-gray-100 rounded px-4 py-2 hover:text-gray-600 focus:outline-none"
            >
              <span className="ml-2  uppercase text-sm font-medium">
                LogOut
              </span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          {children}
        </main>
      </div>
    </div>
  );
}
