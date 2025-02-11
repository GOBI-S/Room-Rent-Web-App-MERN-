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
import { useLocation } from "react-router-dom"; // To highlight the current route dynamically

const data = {
  Ownerdata: [
    {
      title: "Home",
      url: "/home",
      status: false,
    },
    {
      title: "CreateRoom",
      url: "/createroom",
      status: false,
    },
    {
      title: "My Rooms",
      url: "/myrooms",
      status: false,
    },
    {
      title: "Search Rooms",
      url: "/searchrooms",
      status: false,
    },
    {
      title: "My Bookings",
      url: "/Mybooking",
      status: false,
    },
  ],
  userdata: [],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [items, setItems] = React.useState(data.Ownerdata);
  const location = useLocation(); // Get the current route

  // Sync the active state based on the current route
  React.useEffect(() => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        status: item.url === location.pathname, // Set active state based on current URL
      }))
    );
  }, [location.pathname]);

  const handleItemClick = (clickedItem: any) => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        status: item.title === clickedItem.title ? !item.status : item.status, // Toggle only the clicked item
      }))
    );
  };

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
            {items.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className={`border-separate border-s-2 active:none font-medium ${
                  item.status ? "bg-slate-500 text-white" : "bg-transparent"
                }`}
              >
                <SidebarMenuButton asChild onClick={() => handleItemClick(item)}>
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
