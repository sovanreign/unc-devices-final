"use client";

import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

type Crumb = {
  label: string;
  href?: string;
};

interface AppHeaderProps {
  crumbs: Crumb[];
}

export function AppHeader({ crumbs }: AppHeaderProps) {
  const lastIndex = crumbs.length - 1;

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => (
            <>
              <BreadcrumbItem
                key={index}
                className={index < lastIndex ? "hidden md:block" : ""}
              >
                {index === lastIndex || !crumb.href ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < lastIndex && (
                <BreadcrumbSeparator className=" hidden md:block" />
              )}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
