import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../Owner/Ownercomponents/Sidebar";
import { Separator } from "@/components/ui/separator";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
///types
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

const Userhome = () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });
  const navigate = useNavigate();
  const [total, settotal] = useState<Roomtype[]>([]);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  useEffect(() => {
    async function Totalroom() {
      try {
        const response = await axios.get("http://localhost:5000/Userhome", {
          withCredentials: true,
        });
        // console.log("respoonsefrom server:",response.data)
        const rooms = await response.data;
        console.log(rooms);
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
            // If no response, handle network or other errors
            console.error("Axios Error: ", error.message);
          }
        } else {
          // Handle other types of errors
          console.error("An unknown error occurred");
        }
      }
    }
    Totalroom();
  }, []);
  const Userbook = async (id:String) => {
    console.log(id);
    navigate(`/Userhome/${id}`)
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar user="true" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
          </header>
          <div className="my-10 ml-10">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "m-0 w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          <div className="grid grid-cols-3 gap-5 m-3 ">
            {total.map((rooms, index) => (
              <div key={index}>
                <Card>
                  <CardHeader className="flex justify-center items-center">
                    <CardTitle>Owner Name: {rooms.Name}</CardTitle>
                    <Carousel
                      plugins={[plugin.current]}
                      className="w-m max-w-xs"
                      onMouseEnter={plugin.current.stop}
                      onMouseLeave={plugin.current.reset}
                    >
                      <CarouselContent>
                        {rooms.images.map((url, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                  <span className="text-4xl font-semibold">
                                    <img src={`${url}`} />
                                  </span>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </CardHeader>
                  <CardContent>
                    <div className="flex w-full flex-col justify-normal items-center gap-3">
                      <h1 className="font-bold tracking-wide ">
                        {" "}
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
                  <CardFooter className="flex justify-between">
                    <Button onClick={()=>Userbook(rooms._id)}>
                      {true ? "Book in Different date!" : "Book Soon!"}
                    </Button>
                    <Button variant={true ? "destructive" : "default"}>
                      {" "}
                      {true ? "Not Available" : "Available ?"}{" "}
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

export default Userhome;
