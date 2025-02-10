import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import { AppSidebar } from "./Sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAppSelector } from "@/hooks/redduxhook";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'animate.css'; // Import animate.css for animation

interface Roomtype {
  _id: string;
  Email: string;
  Name: string;
  Location: string;
  Price: string;
  Propertyname: string;
  ContactNumber: string;
  Nobedrooms: string;
  images: string[];
}

const Olistroom = () => {
  const navigate = useNavigate();
  const email = useAppSelector((state) => state.user.email);
  const [total, settotal] = useState<Roomtype[]>([]);
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  async function deleteapi(id: any) {
    const data = { id: id };
    try {
      const response = await axios.delete("http://localhost:5000/Delete", {
        data: data,
      });
      console.log("from delete api server side", response.data.message);
    } catch (error) {
      console.error(error);
    }
  }

  async function Totalroom() {
    try {
      const response = await axios.get("http://localhost:5000/Olistroom", {
        params: { email },
        withCredentials: true,
      });
      // console.log("response from server:", response.data);
      const rooms = response.data;
      settotal(rooms);
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

  useEffect(() => {
    Totalroom();
  }, [email]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {total.map((rooms, index) => (
              <div
                key={index}
                className="animate__animated animate__fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }} // Stagger animations
              >
                <Card className="w-full p-4">
                  <CardHeader className="flex justify-center items-center">
                    <CardTitle>Owner Name: {rooms.Name}</CardTitle>
                    <Carousel
                      plugins={[plugin.current]}
                      onMouseEnter={plugin.current.stop}
                      onMouseLeave={plugin.current.reset}
                    >
                      <CarouselContent>
                        {rooms.images.map((url, index) => (
                          <CarouselItem key={index}>
                            <div className="">
                              <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                  <img
                                    src={url}
                                    alt={`Room image ${index}`}
                                    className="object-cover w-full h-full rounded"
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden lg:flex" />
                      <CarouselNext className="hidden lg:flex" />
                    </Carousel>
                  </CardHeader>
                  <CardContent>
                    <div className="flex w-full flex-col justify-normal items-center gap-3">
                      <h1 className="font-bold tracking-wide">
                        Rent Per Day :{" "}
                        <span className="hover:tracking-widest">
                          {rooms.Price}
                        </span>{" "}
                      </h1>
                      <p>Property Name : {rooms.Propertyname}</p>
                      <p>Place : {rooms.Location}</p>
                      <p>Contact : {rooms.ContactNumber}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between flex-col sm:flex-row gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deleteapi(rooms._id);
                      }}
                      className="w-full sm:w-auto"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => navigate(`/Myrooms/${rooms._id}`)}
                      className="w-full sm:w-auto"
                    >
                      Edit
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Olistroom;