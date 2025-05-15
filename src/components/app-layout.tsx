"use client";

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Newspaper } from 'lucide-react';

interface AppLayoutProps {
  sidebarContent: ReactNode;
  children: ReactNode;
}

export function AppLayout({ sidebarContent, children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true} >
      <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
              News Summarizer
            </h1>
          </div>
          <SidebarTrigger className="md:hidden group-data-[collapsible=icon]:hidden" />
        </SidebarHeader>
        <SidebarContent>
          {sidebarContent}
        </SidebarContent>
        <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Contextual News
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
          <SidebarTrigger className="sm:hidden" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
