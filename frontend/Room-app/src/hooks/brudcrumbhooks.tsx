import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  import { Slash } from "lucide-react";
import React from "react";
  import { useLocation } from "react-router-dom";
  
  export default function DynamicBreadcrumb() {
    const location = useLocation();
  
    // Define a mapping for custom breadcrumb labels
    const breadcrumbLabels: { [key: string]: string } = {
      Ownerhome: "Home",
      Createroom: "Create Room",
      RoomList: "Room List",
      Userhome:"Home",
      UserBooking:"Booking",
      
    };
  
    // Split the path into segments and filter out empty values
    const pathnames = location.pathname.split("/").filter((x) => x);
  
    return (
      <Breadcrumb>
        <BreadcrumbList className="flex items-center space-x-2 text-sm">
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            // Get custom label or fallback to a capitalized version of the segment
            const label = breadcrumbLabels[value] || value.replace(/-/g, " ").toUpperCase();
  
            return (
              <React.Fragment key={to}>
                {/* Breadcrumb separator */}
                {index > 0 && (
                  <BreadcrumbSeparator>
                    <Slash />
                  </BreadcrumbSeparator>
                )}
                {/* Breadcrumb item */}
                <BreadcrumbItem>
                  {(
                    <BreadcrumbLink
                      href={to}
                      className="hover:text-primary font-medium"
                    >
                      {label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  