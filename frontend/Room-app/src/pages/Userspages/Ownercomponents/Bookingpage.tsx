import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange as DayPickerDateRange } from "react-day-picker";
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
  const [loading, setLoading] = useState(true);
  const [identifier, setidentifier] = useState(1);
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
  const [bookedDates, setBookedDates] = useState([]);
  const today = new Date();
  const [date, setDate] = useState<DateRange>({
    from: undefined, // No default selection
    to: undefined, // No default selection
  });
  const clearfunction = () => {
    setDate({
      from: undefined,
      to: undefined,
    });
  };

  const disableDates = (date: Date) => {
    // Disable past dates
    if (date < new Date(today.setHours(0, 0, 0, 0))) {
      return true;
    }
    // Disable booked dates
    return bookedDates.some((booking: any) => {
      const fromDate = new Date(booking.from);
      const toDate = new Date(booking.to);
      return fromDate <= date && date <= toDate; // Check if date is in booked range
    });
  };
  useEffect(() => {
    console.log("Booked Dates:", bookedDates);
  }, [bookedDates]);

  const getFirstAvailableDate = () => {
    today.setHours(0, 0, 0, 0); // Normalize today's date

    let checkDate = new Date(today);

    // Loop until we find a date that is not disabled
    while (disableDates(checkDate)) {
      checkDate.setDate(checkDate.getDate() + 1); // Move to the next day
    }
    console.log(checkDate); // Log checkDate at each iteration

    // Set the first available date for both 'from' and 'to' in the state
    setDate({
      from: checkDate,
      to: checkDate,
    });
  };

  useEffect(() => {
    if (date?.from && disableDates(date.from)) {
      getFirstAvailableDate();
    }
  }, [bookedDates, loading]);

  const calculateDaysBetween = (
    from: Date | undefined,
    to: Date | undefined
  ) => {
    if (from && to) {
      return differenceInCalendarDays(to, from);
    }
    return 0;
  };

  const daysBetween = calculateDaysBetween(date?.from, date?.to) + 1;
  const totalprice = daysBetween * Number(Userbookroomdata.Price);

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
  }, []);

  const bookingfunction = async () => {
    if (date.from === undefined || date.to === undefined) {
      alert("Please choose a Date...");
    } else {
      setidentifier(identifier + 1);
      try {
        const response = await axios.post(
          "http://localhost:5000/booked",
          {
            roomid: id,
            bookerId: user.Userid,
            from: date.from,
            to: date.to,
          },
          {
            withCredentials: true,
          }
        );
        console.log("booking sucees ", response.data);
      } catch (error: any) {
        console.log("Error on booking", error.response.data.message);
      }
    }
  };

  const lockbooking = async () => {
    try {
      const response = await axios.get("http://localhost:5000/bookings/get", {
        params: { roomId: id }, // Send `id` as a query parameter
        withCredentials: true, // This should be inside the config object
      });
      const lockeddates = response.data;
      setBookedDates(lockeddates);
    } catch (error: any) {
      console.log(
        "Error on getting booked dates:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false); // Set loading to false after completing the async task
    }
  };

  useEffect(() => {
    lockbooking();
  }, [identifier]);

  const selectdatefunction = (range: DateRange | undefined) => {
    if (!range) return;

    let startDate = range.from;
    let endDate = range.to;

    if (!startDate) return;

    // Check if any date in the range is booked
    const isInvalidRange = bookedDates.some((booking: any) => {
      const fromDate = new Date(booking.from);
      const toDate = new Date(booking.to);

      return (
        (startDate && startDate <= toDate && startDate >= fromDate) || // Start date inside booked range
        (endDate && endDate <= toDate && endDate >= fromDate) || // End date inside booked range
        (startDate && endDate && startDate <= fromDate && endDate >= toDate) // Selected range overlaps a booked range
      );
    });

    if (isInvalidRange) {
      alert("Selected dates are unavailable!");
    } else {
      setDate({
        from: startDate,
        to: endDate || startDate, // If endDate is not selected, set it to startDate
      });
    }
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
      <div className="w-full h-full border grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 xl:gap-20">
        {/* Booking Form Section */}
        <div className="flex h-full items-center justify-center">
          <Card className="h-full w-full flex justify-normal items-center flex-col rounded-none animate__animated animate__fadeIn">
            <CardHeader>
              <h1 className="font-bold tracking-widest text-2xl">
                Booking Form
              </h1>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-col w-2/4 gap-10">
              {/* Input Fields */}
              <Input
                id="Name"
                name="Name:"
                placeholder={user.name}
                disabled
                className="transition-all duration-300 ease-in-out focus:ring-0 focus:ring-transparent focus:outline-none focus:scale-105"
              />
              <Input
                id="Email"
                name="Email"
                placeholder={user.email}
                disabled
                className="transition-all duration-300 ease-in-out focus:ring-0 focus:ring-transparent focus:outline-none focus:scale-105"
              />

              {/* Date Picker Section */}
              <label htmlFor="calendar">Enter the range of date You want to stay:</label>
              <div className="grid gap-2 animate__animated animate__fadeInUp">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "transition-all duration-300 ease-in-out focus:ring-0 focus:ring-transparent focus:outline-none focus:scale-105",
                        !date && "text-muted-foreground",
                        "transition-all duration-300 ease-in-out"
                      )}
                    >
                      <CalendarIcon className="w-5 h-5 lg:w-6 lg:h-6" />
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

                  <PopoverContent className="w-auto p-0 flex flex-col" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={today}
                      selected={date}
                      onSelect={(range) => selectdatefunction(range)}
                      numberOfMonths={2}
                      disabled={disableDates}
                      className="animate__animated animate__fadeIn "
                      classNames={{
                        day_disabled:
                          "opacity-50 cursor-not-allowed text-red-500", // Disable style
                      }}
                    />
                    <Button
                      variant="outline"
                      className="items-center justify-center mt-3"
                      onClick={clearfunction}
                    >
                      Clear
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>

              <span className="mt-5 animate__animated animate__fadeIn">
                Total Days: {daysBetween}
              </span>

              {/* Billing Section */}
              <div className="bg-sidebar-primary w-[300px] h-[50px] flex justify-center items-center rounded-md border">
                <h1 className="font-medium tracking-widest text-1.5xl">
                  Billing Amount: ${totalprice} + Tax
                </h1>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => {
                  bookingfunction();
                }}
                className="transition-all duration-300 ease-in-out transform active:scale-90"
              >
                Book Now!
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Room Details Section */}
        <div className="animate__animated animate__fadeInRight">
          <Card className="h-full flex justify-center items-center flex-col gap-16 pt-36 rounded-none">
            <CardHeader className="flex justify-center items-center">
              <CardTitle>Owner Name: {Userbookroomdata.Name}</CardTitle>
              <Carousel
                plugins={[plugin.current]}
                className="max-w-xs w-[900px]"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {Userbookroomdata.images.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <span className="text-4xl font-semibold">
                              <img src={`${url}`} alt={`Room ${index}`} />
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
              </Carousel>
            </CardHeader>

            <CardContent>
              <div className="flex w-full flex-col justify-normal items-center gap-3">
                <h1 className="font-bold tracking-wide">
                  Rent Per Day:{" "}
                  <span className="hover:tracking-widest">{Userbookroomdata.Price}</span>
                </h1>
                <p>Property Name: {Userbookroomdata.Propertyname}</p>
                <p>Location: {Userbookroomdata.Location}</p>
                <p>Contact: {Userbookroomdata.ContactNumber}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</>

  );
};

export default UserBookingpage;
