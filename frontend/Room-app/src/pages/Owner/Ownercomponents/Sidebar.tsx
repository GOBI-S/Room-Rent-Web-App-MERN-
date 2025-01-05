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
const data = {
  Ownerdata: [
    {
      title: "Home",
      url: "/Ownerhome",
    },
    {
      title: "CreateRoom",
      url: "/Createroom",
    },
    {
      title: "Room List",
      url: "/Roomlist",
    },
    {
      title:"Chats",
      url:"/OwnerChat"
    }
  ],
  userdata: [
    {
      title: "Home",
      url: "/Userhome",
    },
    {
      title: "Booked",
      url:"/Booked"
    },
    {
      title:"Chats",
      url:"/UserChats"
    }
  ],
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
                  <img src="/PngItem_766038.png" alt=""  className="p-2"/>
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
            {(user === "true" ? data.userdata : data.Ownerdata).map((item) => (
              <SidebarMenuItem
                key={item.title}
                className="border-separate border-s-2"
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
