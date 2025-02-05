import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { title } from "process";
const data = {
  Ownerdata: [
    {
      title: "Home",
      url: "/Home",
    },
    {
      title: "CreateRoom",
      url: "/Createroom",
    },
    {
      title: "My Rooms",
      url: "/Myrooms",
    },
    {
      title: "Chats",
      url: "/Chat",
    },
    {
      title: "Search Rooms",
      url: "/Searchrooms",
    },
    {
      title: "Booked Rooms",
      url: "/Booked",
    },
    {
      title:"My Bookings",
      url:"/Mybooking"
    }
  ],
  userdata: [],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src="/PngItem_766038.png" alt="" className="p-2" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Room Rent</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.Ownerdata.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className="border-separate border-s-2 active:none"
              >
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
