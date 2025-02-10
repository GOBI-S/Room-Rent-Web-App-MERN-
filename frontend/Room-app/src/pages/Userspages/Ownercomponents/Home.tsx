import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Separator } from "@/components/ui/separator";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import axios from "axios";
import { useAppSelector } from "@/hooks/redduxhook";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OwnerHome = () => {
  const user = useAppSelector((state) => state.user);
  const email = useAppSelector((state) => state.user.email);
  const navigate = useNavigate();

  const [total, settotal] = useState("wait...");

  useEffect(() => {
    async function Totalroom() {
      try {
        const response = await axios.get("http://localhost:5000/Ownerhome", {
          params: { email },
          withCredentials: true,
        });
        console.log("Response from server:", response.data.message);
        const data = await response.data;
        settotal(data.total);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 401) {
              navigate("/login");
              console.error("Unauthorized: No token or invalid token.");
            } else {
              console.error(
                "Error:",
                error.response.data.message || "Something went wrong."
              );
            }
          } else {
            console.error("Axios Error: ", error.message);
          }
        } else {
          console.error("An unknown error occurred");
        }
      }
    }
    Totalroom();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>

        <div className="flex m-20 flex-col justify-center items-center gap-24 animate__animated animate__fadeIn">
          <div className="text-4xl md:text-5xl font-extrabold tracking-widest text-center animate__animated animate__fadeInUp animate__delay-1s">
            Hello! Welcome Back {user.name}
          </div>
          <div className="text-3xl md:text-4xl tracking-widest text-center animate__animated animate__fadeInUp animate__delay-1.5s">
            Total rooms on Your Name:{" "}
            <span className="text-5xl md:text-6xl text-blue-500">{total}</span>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default OwnerHome;
