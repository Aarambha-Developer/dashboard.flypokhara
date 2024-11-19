const routes = [
  {
    id: 1,
    href: "/",
    name: "Dashboard",
  },
  {
    id: 2,
    href: "/agencies",
    name: " Agencies",
    adminOnly: true, // Adding a flag to indicate admin-only access
  },
  {
    id: 3,
    href: "/booking",
    name: "Booking",
  },
  {
    id: 4,
    href: "/change-password",
    name: "Settings",
  },
];

export default routes;
