"use client";

import {
  Home,
  Settings,
  Menu,
  LogOut,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { userDetailsSelector } from "@/app/features/userManagement/userSelectors";

const adminNav = [
  {
      label: "User Management",
      href: "/user-management",
      icon: <Users size={20} />,
    }
]
const teacherNav = [
  {
      label: "student",
      href: "/students",
      icon: <Users size={20} />,
    }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [navItems, setNavItems] = useState<{
    label: string;
    href: string;
    icon: React.ReactNode
  }[]| []>([]);
  const userDetails = useSelector(userDetailsSelector);
  const pathname = usePathname();
  const router = useRouter();

  // const navItems = [
  //   {
  //     label: "Dashboard",
  //     href: "/dashboard",
  //     icon: <LayoutDashboard size={20} />,
  //   },
  //   {
  //     label: "User Management",
  //     href: "/user-management",
  //     icon: <Users size={20} />,
  //   },
  //   { label: "Home", href: "/", icon: <Home size={20} /> },
  //   // Add more routes if needed
  // ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  useEffect(() => {
    if (userDetails) {
      if (userDetails?.data.role === "ADMIN") {
       setNavItems(adminNav)
      }
      if(userDetails?.data.role === "TEACHER"){
        setNavItems(teacherNav)
      }
    }
  }, [userDetails]);

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
                src="/boy_avatar.jpg"
                alt="User Avatar"
                width={25}
                height={25}
                className="rounded-full"
              />
              {!collapsed && (
                <div>
                  <p className="w-32  text-sm font-medium text-gray-800 dark:text-white truncate">
                    {`${userDetails?.data?.first_name} ${userDetails?.data?.last_name}`}
                  </p>
                  <p className="w-32 text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userDetails?.data?.email}
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
          collapsed={collapsed}
          onClick={handleLogout}
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
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  const classNames = `
    flex items-center p-2 rounded-md transition-colors text-sm font-medium w-full
    ${
      active
        ? "bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
    }
  `;

  const content = (
    <>
      <div>{icon}</div>
      {!collapsed && <span className="ml-3">{label}</span>}
    </>
  );

  // Use Link if href is present
  if (href) {
    return (
      <Link href={href} className={classNames}>
        {content}
      </Link>
    );
  }

  // Use button/div if onClick is present
  if (onClick) {
    return (
      <Button onClick={onClick} className={classNames} type="button">
        {content}
      </Button>
    );
  }

  // Fallback (neither href nor onClick)
  return <div className={classNames}>{content}</div>;
}
