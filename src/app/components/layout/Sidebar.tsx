"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  MessagesSquare,
  LogOut,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

// ... (navItems array remains the same)
const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Blogs", href: "/dashboard/blogs", icon: Newspaper },
  { name: "Contacts", href: "/dashboard/contacts", icon: MessagesSquare },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize router
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully!");
      router.push("/login"); // Redirect to login page
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 h-screen p-4 border-r border-border bg-primary/70 backdrop-blur-xl">
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold text-center text-white mb-10">
          Admin Panel
        </h1>
        <nav className="flex-grow">
          {/* ... navItems.map remains the same ... */}
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name} className="mb-2">
                  <Link
                    href={item.href}
                    className={`flex text-secondary items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-accent text-white"
                        : "text-text-secondary hover:bg-border hover:text-white"
                    }`}
                  >
                    <item.icon className=" text-secondary w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center w-full p-3 rounded-lg text-text-secondary hover:bg-red-800/50 hover:text-white transition-colors duration-200 disabled:opacity-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
