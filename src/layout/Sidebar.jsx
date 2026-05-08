import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/meals", label: "Meals" },
  { to: "/add", label: "Add Food" },
  { to: "/progress", label: "Progress" },
  { to: "/profile", label: "Profile" },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold mb-6">Support Dashboard</h2>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
