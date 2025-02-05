import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import { AppSidebar } from "./Sidebar";
import axios from "axios";

const Mybbooking = () => {
  const gettinginfo = async () => {
    try {
      const response = await axios.get("http://localhost:5000/bookings/gets", {
        withCredentials: true, // Ensures cookies are sent with the request
      });

      const data = response.data;
      console.log("Fetched Data:", data); // Debugging log
    } catch (error: any) {
      console.error("Error fetching data:", error.message || error);

      // If it's an Axios error, log the response details
      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }
    }
  };
  gettinginfo()

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
          </header>
          <div className="grid grid-cols-3 gap-5 m-3"></div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Mybbooking;
