const routes = [
  {
    id: 1,
    href: "/",
    name: "Dashboard",
    role: ["ADMIN", "AGENCY"],
  },
  {
    id: 2,
    href: "/agencies",
    name: " Agencies",
    // adminOnly: true, // Adding a flag to indicate admin-only access
    role: ["ADMIN"],
  },
  {
    id: 3,
    href: "/booking",
    name: "Booking",
    role: ["AGENCY", "ADMIN", "AIRPORT"],
  },
  {
    id: 4,
    href: "/settings",
    name: "Settings",
    role: ["AGENCY", "ADMIN", "AIRPORT"],
  },
];

export default routes;
