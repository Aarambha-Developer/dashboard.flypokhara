"use client";
import { getCookie } from "@/lib/cookie-handler";
import routes from "@/Routes/routes";
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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // const isAdmin = await getCookie("isAdmin"); // Assumes "isAdmin" cookie holds "true" or "false"

  // const filteredRoutes = routes.filter(
  //   (route) => !route.adminOnly || isAdmin === "true"
  // );

  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = getCookie("access_token");
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <nav>
          {routes.map((route, index) => (
            <Link
              key={index}
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
              Admin Dashboard
            </h2>
          </div>
          <div className="flex items-center">
            <button className="flex items-center text-gray-500 hover:text-gray-600 focus:outline-none">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="/placeholder.svg?height=32&width=32"
                alt="User avatar"
              />
              <span className="ml-2 text-sm font-medium">John Doe</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          {/* <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
            <div className="mt-4">
              <div className="flex flex-wrap -mx-6">
                <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">
                        8,282
                      </h4>
                      <div className="text-gray-500">New Users</div>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">
                        200,521
                      </h4>
                      <div className="text-gray-500">Total Products</div>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                  <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                    <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700">
                        215,542
                      </h4>
                      <div className="text-gray-500">Total Orders</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8"></div>
          </div> */}
          {children}
        </main>
      </div>
    </div>
  );
}
