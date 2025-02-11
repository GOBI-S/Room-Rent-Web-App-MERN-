import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import { AppSidebar } from "./Sidebar";
import axios from "axios";
import { useAppSelector } from "@/hooks/redduxhook";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Booking = {
  bookerId: string;
  from: string;
  to: string;
};

type Room = {
  roomid: string;
  booked: Booking[];
};


const Mybbooking = () => {
  const URI="https://roomrentweb.gobidev.site";
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const plugin = React.useRef(
  //   Autoplay({ delay: 2000, stopOnInteraction: true })
  // );
  const [deatilsofroom, setdeatilsofroom] = useState<any>({});
  const [roomNames, setRoomNames] = useState<{ [key: string]: string }>({});
  const [rooms, setRooms] = useState<Room[]>([]);
  const userId = useAppSelector((state) => state.user.Userid);
  const gettinginfo = async () => {
    try {
      const response = await axios.get(`${URI}/bookings/gets`, {
        withCredentials: true,
      });
      const data: Room[] = response.data;
      const userBookings = data
        .map((room) => ({
          roomid: room.roomid,
          booked: room.booked.filter((b) => b.bookerId === userId),
        }))
        .filter((room) => room.booked.length > 0);
      setRooms(userBookings);
    } catch (error: any) {
      console.error("Error fetching data:", error.message || error);
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
  const findRoomById = async (roomid: string) => {
    try {
      const response = await axios.get(
        `${URI}/bookingroomdata`,
        {
          withCredentials: true,
          params: { id: roomid },
        }
      );
      return response.data.Propertyname;
    } catch (error) {
      console.error("Error fetching room name:", error);
      return "Unknown Room";
    }
  };
  const fetchdata = async (roomid: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${URI}/bookingroomdata`,
        {
          withCredentials: true,
          params: { id: roomid },
        }
      );
      setdeatilsofroom(response.data);
    } catch (error) {
      console.error("Error fetching room name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoomNames = async () => {
      const roomNameMap: { [key: string]: string } = {};
      const roomNamePromises = rooms.map((room) =>
        findRoomById(room.roomid).then((roomName) => {
          roomNameMap[room.roomid] = roomName;
        })
      );
      await Promise.all(roomNamePromises);
      setRoomNames(roomNameMap);
    };

    if (rooms.length > 0) {
      fetchRoomNames();
    }
  }, [rooms]);
  // findUserBookings(userId,rooms)
  // useEffect(() => {
  //   console.log(
  //     rooms.map((room) => {
  //       console.log("roomid:", room.roomid);
  //       room.booked.map((book) => {
  //         console.log("from:", book.from, "to:", book.to);
  //       });
  //     })
  //   );
  //   console.log(rooms);
  // }, [rooms]);
  useEffect(() => {
    if (userId) {
      gettinginfo();
    }
  }, [userId]);

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
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="p-4 max-w-4xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                My Bookings
              </h2>

              {rooms.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md bg-sidebar  overflow-y-auto max-h-[700px] ">
                  <Table className="w-full text-white bg-black ">
                    <TableHeader className="bg-sidebar-primary">
                      <TableRow className="">
                        <TableHead className="p-3 text-center text-white ">
                          Propety Name
                        </TableHead>
                        <TableHead className="p-3 text-center text-white ">
                          From
                        </TableHead>
                        <TableHead className="p-3 text-center text-white">
                          To
                        </TableHead>
                        <TableHead className="p-3 text-center text-white"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.map((room) =>
                        room.booked.map((booking, index) => (
                          <motion.tr
                            key={`${room.roomid}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="border-b border-gray-700 bg-sidebar hover:bg-slate-500 transition-all"
                          >
                            <TableCell className="p-3 text-center">
                              {roomNames[room.roomid] || "Loading..."}
                            </TableCell>
                            <TableCell className="p-3 text-center">
                              {new Date(booking.from).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="p-3 text-center">
                              {new Date(booking.to).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="p-3 text-center">
                              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      fetchdata(room.roomid);
                                      setIsOpen(true);
                                    }}
                                    aria-label="View room details"
                                    className="bg-gray-900 text-white hover:bg-gray-700"
                                  >
                                    Details
                                  </Button>
                                </DialogTrigger>
                                <AnimatePresence>
                                  {isOpen && (
                                    <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]   text-white">
                                      <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <DialogHeader>
                                          <DialogTitle className="text-center text-2xl font-bold text-white">
                                            Room Details
                                          </DialogTitle>
                                        </DialogHeader>
                                        {isLoading ? (
                                          <div className="flex justify-center items-center h-40">
                                            <motion.div
                                              animate={{ rotate: 360 }}
                                              transition={{
                                                duration: 1,
                                                repeat:
                                                  Number.POSITIVE_INFINITY,
                                                ease: "linear",
                                              }}
                                              className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                                            />
                                          </div>
                                        ) : (
                                          deatilsofroom && (
                                            <Card className="border-none shadow-none ">
                                              <CardHeader>
                                                <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                                                  <CarouselContent>
                                                    {deatilsofroom.images &&
                                                      deatilsofroom.images.map(
                                                        (
                                                          url: string,
                                                          index: number
                                                        ) => (
                                                          <CarouselItem
                                                            key={index}
                                                          >
                                                            <div className="p-1">
                                                              <Card className="bg-transparent">
                                                                <CardContent className="flex aspect-square items-center justify-center p-2">
                                                                  <motion.img
                                                                    src={url}
                                                                    alt={`Room ${
                                                                      index + 1
                                                                    }`}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                    initial={{
                                                                      opacity: 0,
                                                                    }}
                                                                    animate={{
                                                                      opacity: 1,
                                                                    }}
                                                                    transition={{
                                                                      duration: 0.5,
                                                                    }}
                                                                  />
                                                                </CardContent>
                                                              </Card>
                                                            </div>
                                                          </CarouselItem>
                                                        )
                                                      )}
                                                  </CarouselContent>
                                                  <CarouselPrevious className="hidden sm:flex " />
                                                  <CarouselNext className="hidden sm:flex" />
                                                </Carousel>
                                              </CardHeader>

                                              <CardContent>
                                                <motion.div
                                                  className="flex w-full flex-col justify-normal items-center gap-3 text-center"
                                                  initial={{
                                                    opacity: 0,
                                                    y: 20,
                                                  }}
                                                  animate={{ opacity: 1, y: 0 }}
                                                  transition={{
                                                    delay: 0.2,
                                                    duration: 0.5,
                                                  }}
                                                >
                                                  <h1 className="font-bold tracking-wide text-xl text-white">
                                                    Rent Per Day:{" "}
                                                    <motion.span
                                                      className="text-blue-400"
                                                      whileHover={{
                                                        scale: 1.05,
                                                      }}
                                                      transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                      }}
                                                    >
                                                      {deatilsofroom.Price ||
                                                        "N/A"}
                                                    </motion.span>
                                                  </h1>
                                                  <p className="text-lg text-gray-300">
                                                    Property Name:{" "}
                                                    {deatilsofroom.Propertyname ||
                                                      "N/A"}
                                                  </p>
                                                  <p className="text-lg text-gray-300">
                                                    Place:{" "}
                                                    {deatilsofroom.Location ||
                                                      "N/A"}
                                                  </p>
                                                  <p className="text-lg text-gray-300">
                                                    Contact:{" "}
                                                    {deatilsofroom.ContactNumber ||
                                                      "N/A"}
                                                  </p>
                                                </motion.div>
                                              </CardContent>
                                            </Card>
                                          )
                                        )}

                                        <DialogFooter className="flex justify-center mt-4">
                                          <DialogClose asChild>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              className="bg-gray-700 text-white hover:bg-gray-600"
                                            >
                                              Close
                                            </Button>
                                          </DialogClose>
                                        </DialogFooter>
                                      </motion.div>
                                    </DialogContent>
                                  )}
                                </AnimatePresence>
                              </Dialog>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <p className="text-gray-400 text-center">End...</p>
                </div>
              ) : (
                <p className="text-gray-400 text-center">No bookings found.</p>
              )}
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Mybbooking;
