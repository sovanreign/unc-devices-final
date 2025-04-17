"use client";

import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

type Crumb = {
  label: string;
  href?: string;
};

interface BodyProps {
  children: ReactNode;
  crumbs?: Crumb[];
}

export default function Body({ children, crumbs = [] }: BodyProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader crumbs={crumbs} />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
