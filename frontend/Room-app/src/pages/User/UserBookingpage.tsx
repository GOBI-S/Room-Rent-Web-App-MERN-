import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../Owner/Ownercomponents/Sidebar";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils"
import { DateRange as DayPickerDateRange } from 'react-day-picker';
import { differenceInCalendarDays } from "date-fns";

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
type DateRange = DayPickerDateRange;

const UserBookingpage = () => {
    const today = new Date();
    const [date, setDate] = useState<DateRange>({
        from: today,
        to: addDays(today, 1), // Example: Set default end date as tomorrow
      });
      const disablePastDays = (date: Date) => {
        return date < new Date(today.setHours(0, 0, 0, 0)); // Only allow today and future dates
      };
  const user = useSelector((state: RootState) => state.user);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const navigate = useNavigate();
  const { id } = useParams();
  const [Userbookroomdata, setUserbookroomdata] = useState<Roomtype>({
    _id: "",
    Email: "",
    Name: "",
    Location: "",
    Price: "",
    Propertyname: "",
    ContactNumber: "",
    Nobedrooms: "",
    images: [],
  });
//////between days finding function///
const calculateDaysBetween = (from: Date | undefined, to: Date | undefined) => {
    if (from && to) {
      return differenceInCalendarDays(to, from);
    }
    return 0;
  };
  const daysBetween = calculateDaysBetween(date?.from, date?.to)+1;
  const totalprice=daysBetween*Number(Userbookroomdata.Price)
  console.log(totalprice)
  console.log(daysBetween)
  useEffect(() => {
    const UserBookingroomdata = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/bookingroomdata",
          {
            params: { id },
            withCredentials: true,
          }
        );
        const bookingroom = response.data;
        setUserbookroomdata(bookingroom);
      } catch (error) {
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
    };
    UserBookingroomdata();
  }, [id]);
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
          <div className="w-full h-full  border ">
            <ResizablePanelGroup
              direction="horizontal"
              className="w-screen h-screen  border rounded-none"
            >
              <ResizablePanel defaultSize={25} maxSize={60} minSize={40}>
                <Card className="h-full flex justify-centre items-center flex-col gap-16 pt-36 rounded-none">
                  <CardHeader className="flex justify-center items-center">
                    <CardTitle>Owner Name: {Userbookroomdata.Name}</CardTitle>
                    <Carousel
                      plugins={[plugin.current]}
                      className=" max-w-xs w-[900px]"
                      onMouseEnter={plugin.current.stop}
                      onMouseLeave={plugin.current.reset}
                    >
                      <CarouselContent className="">
                        {Userbookroomdata.images.map((url, index) => (
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
                          {Userbookroomdata.Price}
                        </span>{" "}
                      </h1>
                      <p>Property Name : {Userbookroomdata.Propertyname}</p>
                      <p>Place : {Userbookroomdata.Location}</p>
                      <p>Contact : {Userbookroomdata.ContactNumber}</p>
                    </div>
                  </CardContent>
                </Card>
                <div />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={75} minSize={40}>
                <div className="flex h-full items-center justify-center ">
                  <Card className="h-full w-full flex justify-normal items-center flex-col   rounded-none">
                    <CardHeader>
                      <h1 className="font-bold tracking-widest text-2xl">
                        Booking Form
                      </h1>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center  flex-col w-2/4 gap-10">
                      <Input
                        id="Name"
                        name="Name:"
                        placeholder={user.name}
                        disabled
                      ></Input>
                      <Input
                        id="Email"
                        name="Email"
                        placeholder={user.email}
                        disabled
                      ></Input>
                      {/* //////////////////date picker////////////////// */}
                      <label htmlFor="calander">Enter the range of date You wanted to stay:</label>
                      <div className={cn("grid gap-2")}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              variant={"outline"}
                              className={cn(
                                "w-[300px] justify-start text-left font-normal",
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
                               defaultMonth={today}
                               selected={date}
                               onSelect={(range) => setDate(range || { from: today, to: today })} // Match type here
                               numberOfMonths={2}
                               disabled={disablePastDays}
                               />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <span className="mt-5">Total Days : {daysBetween}</span>
                      {/* ///////////////////////////////////////////// */}
                      <div className="bg-sidebar-primary w-[300px] h-[50px] flex justify-center items-center rounded-md border">
                      <h1 className="font-medium tracking-widest text-1.5xl"> Billing Amount: ${totalprice} +Tax</h1>
                      </div>
                    </CardContent>

                    <CardFooter>
                        <Button> Book Now !</Button>
                    </CardFooter>
                  </Card>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default UserBookingpage;
