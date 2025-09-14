"use client";

import { Home, Settings, Menu, LogOut,LayoutDashboard  } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard  size={20} /> },
    { label: "Home", href: "/", icon: <Home size={20} /> },
    // Add more routes if needed
  ];

  return (
    <div
      className={`h-screen bg-white dark:bg-gray-900 border-r transition-all duration-300 flex flex-col ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Top Section */}
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <>
            {/* User Info */}
            <div className="px-2 py-2 flex items-center space-x-3">
              <Image
                src="/avatar.png"
                alt="User Avatar"
                width={20}
                height={20}
                className="rounded-full"
              />
              {!collapsed && (
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    john@example.com
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 mt-4 px-2 space-y-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            collapsed={collapsed}
            active={pathname === item.href}
          />
        ))}
      </nav>

      {/* Bottom Buttons */}
      <div className="p-2 space-y-1 border-t dark:border-gray-800">
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          href="/settings"
          collapsed={collapsed}
          active={pathname === "/settings"}
        />
        <SidebarItem
          icon={<LogOut size={20} />}
          label="Logout"
          href="/logout"
          collapsed={collapsed}
          active={false}
        />
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  collapsed,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center p-2 rounded-md transition-colors text-sm font-medium
        ${
          active
            ? "bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
        }
      `}
    >
      <div className="w-6">{icon}</div>
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
}
