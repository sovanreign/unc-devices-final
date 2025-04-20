"use client";

import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Image from "next/image";
import { MdDashboard, MdDevices, MdBook } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

const fullNav = [
  { title: "Dashboard", url: "/dashboard", icon: MdDashboard },
  { title: "Devices", url: "/devices", icon: MdDevices },
  { title: "Transactions", url: "/transactions", icon: MdBook },
  { title: "Users", url: "/users", icon: FaUsers },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [navItems, setNavItems] = useState(fullNav);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);

      // Role-based nav filtering
      if (parsed.role === "Teacher") {
        setNavItems(fullNav.filter((item) => item.title === "Transactions"));
      }

      // Default avatar fallback
      setUser({
        name: parsed.name || "User",
        email: parsed.email || "noreply@unc.edu.ph",
        avatar: parsed.avatar || "/avatars/default.jpg", // ✅ fallback to your default avatar
      });
    }
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Image
                    src="/unc-logo-only.png"
                    alt=""
                    width={32}
                    height={32}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">UNC Devices</span>
                  <span className="truncate text-xs">Inventory & Tracking</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={
            user || {
              name: "User",
              email: "noreply@unc.edu.ph",
              avatar: "/avatars/default.jpg",
            }
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
