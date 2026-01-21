"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  MessagesSquare,
} from "lucide-react";
import dynamic from "next/dynamic";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Blogs", href: "/blogs", icon: Newspaper },
  { name: "Contacts", href: "/dashboard/contacts", icon: MessagesSquare },
];

const AuthButton = dynamic(
  () => import("@/app/components/UI/AuthButton/authButton"),
  { ssr: false },
);

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 h-screen p-4 border-r border-border bg-primary/70 backdrop-blur-xl">
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold text-center text-white mb-10">
          Admin Panel
        </h1>

        <nav className="flex-grow">
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name} className="mb-2">
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-accent text-white"
                        : "text-secondary hover:bg-border hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="pt-4 border-t border-border">
          <AuthButton />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
