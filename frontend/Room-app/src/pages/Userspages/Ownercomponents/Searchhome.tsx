import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAppSelector } from "@/hooks/redduxhook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Autoplay from "embla-carousel-autoplay";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import { AppSidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

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
  Createrid: string;
}

const Userhome = () => {
  const [bookedDates, setBookedDates] = useState<{
    [key: string]: Array<{ from: Date; to: Date }>;
  }>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const userId = useAppSelector((state) => state.user.Userid);
  const [date, setDate] = useState<DateRange | undefined>();
  const navigate = useNavigate();
  const [total, setTotal] = useState<Roomtype[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Roomtype[]>([]);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const isRoomAvailable = (
    roomId: string,
    dateRange: DateRange | undefined
  ) => {
    if (!dateRange?.from || !dateRange?.to) return true;

    const booked = bookedDates[roomId] || [];
    const selectedFrom = dateRange.from;
    const selectedTo = dateRange.to;

    return !booked.some((booking) => {
      const bookingFrom = booking.from;
      const bookingTo = booking.to;
      return (
        (selectedFrom >= bookingFrom && selectedFrom <= bookingTo) ||
        (selectedTo >= bookingFrom && selectedTo <= bookingTo) ||
        (selectedFrom <= bookingFrom && selectedTo >= bookingTo)
      );
    });
  };

  const lockbooking = async (id: string) => {
    try {
      const response = await axios.get("http://localhost:5000/bookings/get", {
        params: { roomId: id }, // Changed to roomId to match common API conventions
        withCredentials: true,
      });
      const lockeddates = response.data;
      setBookedDates((prev) => ({
        ...prev,
        [id]: lockeddates.map((date: { from: string; to: string }) => ({
          from: new Date(date.from),
          to: new Date(date.to),
        })),
      }));
    } catch (error: any) {
      console.error(
        "Error fetching booked dates:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        // Fetch booked dates for all rooms in `total`
        await Promise.all(total.map((room) => lockbooking(room._id)));
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      } finally {
        // Ensure loading state is set to false, even if there's an error
        setLoading(false);
      }
    };

    // Call the function only if `total` is defined and not empty
    if (total && total.length > 0) {
      fetchBookedDates();
    } else {
      // If `total` is empty, set loading to false immediately
      setLoading(false);
    }
  }, [total]); // Add `total` as a dependency

  useEffect(() => {
    if (!loading) {
      const filtered = total.filter((room) => isRoomAvailable(room._id, date));
      setFilteredRooms(filtered);
    }
  }, [loading, bookedDates, date, total]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await axios.get("http://localhost:5000/Userhome", {
          withCredentials: true,
        });
        const rooms = response.data;
        const filtered = rooms.filter(
          (room: Roomtype) => room.Createrid !== userId
        );
        setTotal(filtered);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            navigate("/login");
          } else {
            console.error(
              "Error:",
              error.response?.data?.message || "Something went wrong."
            );
          }
        } else {
          console.error("An unknown error occurred");
        }
      }
    }
    fetchRooms();
  }, [navigate, userId]);

  const handleBookNow = (id: string) => {
    navigate(`/Searchrooms/${id}`);
  };

  const handleSendEmail = (email: string) => {
    if (!message.trim()) {
      alert("Please enter a message before sending the email.");
      return;
    }

    const subject = encodeURIComponent("Room Inquiry");
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
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
          <h1 className="text-1xl font-medium">Find by available date</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "m-0 w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
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
                defaultMonth={new Date()}
                selected={date}
                onSelect={(range) => {
                  if (range?.from && !range.to) {
                    // If only "from" is selected, set "to" as the same date
                    setDate({ from: range.from, to: range.from });
                  } else {
                    setDate(range); // Otherwise, set as usual
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-3 gap-5 m-3">
          {filteredRooms.map(
            (
              room // Changed from total to filteredRooms
            ) => (
              <Card key={room._id}>
                <CardHeader className="flex justify-center items-center">
                  <CardTitle>Owner Name: {room.Name}</CardTitle>
                  <Carousel
                    plugins={[plugin.current]}
                    className="w-m max-w-xs"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                  >
                    <CarouselContent>
                      {room.images.map((url, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                <img
                                  src={url}
                                  alt={`Room ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
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
                    <h1 className="font-bold tracking-wide">
                      Rent Per Day:{" "}
                      <span className="hover:tracking-widest">
                        {room.Price}
                      </span>
                    </h1>
                    <p>Property Name: {room.Propertyname}</p>
                    <p>Place: {room.Location}</p>
                    <p>Contact: {room.ContactNumber}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={() => handleBookNow(room._id)}>
                    Book Now!
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Email To</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-center">Email</DialogTitle>
                        <DialogDescription className="text-center">
                          Write an email to the room owner
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Recipient</Label>
                          <Input id="email" value={room.Email} readOnly />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="message">Message</Label>
                          <Input
                            id="message"
                            placeholder="Enter your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex justify-between">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                        <Button
                          type="button"
                          onClick={() => handleSendEmail(room.Email)}
                          disabled={!message.trim()}
                        >
                          Send
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            )
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Userhome;
