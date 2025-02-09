import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import { AppSidebar } from "./Sidebar";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import "animate.css"; // Import animate.css for animations

interface RoomData {
  Email: string;
  Name: string;
  Location: string;
  Price: string;
  Propertyname: string;
  ContactNumber: string;
  Nobedrooms: string;
  Cloudurl: string[];
  NormalUrl: string[];
  Delurls: string[];
  id: string;
}

const Editroom: React.FC = () => {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const user = useSelector((state: RootState) => state.user);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  const [roomdata, setroomdata] = useState({
    Email: "",
    Name: "",
    Location: "",
    Price: "",
    Propertyname: "",
    ContactNumber: "",
    Nobedrooms: "",
    images: [],
  });
  const { id } = useParams();
  const [Editroomdata, setEditroomdata] = useState<RoomData>({
    Email: user.email,
    Name: user.name,
    Location: "",
    Price: "",
    Propertyname: "",
    ContactNumber: "",
    Nobedrooms: "",
    Cloudurl: [],
    NormalUrl: [],
    Delurls: [],
    id: id || "",
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/Edit", {
          params: { id },
          withCredentials: true,
        });
        const data = await response.data;
        setroomdata(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoomData();
  }, [id]);

  useEffect(() => {
    if (roomdata.Email) {
      setEditroomdata((prev) => ({
        ...prev,
        Email: roomdata.Email,
        Name: roomdata.Name,
        Location: roomdata.Location,
        Price: roomdata.Price,
        Propertyname: roomdata.Propertyname,
        ContactNumber: roomdata.ContactNumber,
        Nobedrooms: roomdata.Nobedrooms,
        Cloudurl: roomdata.images,
      }));
    }
  }, [roomdata]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditroomdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setEditroomdata((prev) => ({
      ...prev,
      Nobedrooms: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const base64Files: string[] = [];
      const promises = filesArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            if (reader.result) {
              base64Files.push(reader.result as string);
              resolve(reader.result as string);
            }
          };
        });
      });
      Promise.all(promises).then(() => {
        const fileURLs = filesArray.map((file) => URL.createObjectURL(file));
        setBlobUrls(fileURLs);
        setEditroomdata((prev) => ({
          ...prev,
          NormalUrl: base64Files,
        }));
      });
    }
  };

  const imagedelete = (index: number) => {
    const updatedCloudUrls = [...Editroomdata.Cloudurl];
    if (updatedCloudUrls.length > 1) {
      setEditroomdata((prev) => ({
        ...prev,
        Delurls: [...(prev.Delurls || []), updatedCloudUrls[index]],
      }));
      updatedCloudUrls.splice(index, 1);
      setEditroomdata((prev) => ({
        ...prev,
        Cloudurl: updatedCloudUrls,
      }));
    }
  };

  const updateapi = async () => {
    try {
      setisloading(true);
      const response = await axios.put(
        "http://localhost:5000/Editeddata",
        Editroomdata
      );
      console.log("response from server:", response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setisloading(false);
      navigate("/Roomlist");
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 animate__animated animate__fadeIn">
            <div>
              <Card className="animate__animated animate__fadeInLeft">
                {isloading && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                  </div>
                )}
                <CardHeader className="flex justify-center items-center font-bold">
                  <h1>ROOM DATA</h1>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center font-medium gap-y-10 tracking-widest">
                  <h1>Email: {roomdata.Email}</h1>
                  <h1>Name: {roomdata.Name}</h1>
                  <h1>Location: {roomdata.Location}</h1>
                  <h1>Price: {roomdata.Price}</h1>
                  <h1>Propertyname: {roomdata.Propertyname}</h1>
                  <h1>ContactNumber: {roomdata.ContactNumber}</h1>
                  <h1>Nobedrooms: {roomdata.Nobedrooms}</h1>
                  <Carousel
                    plugins={[plugin.current]}
                    className="w-full max-w-xs"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                  >
                    <CarouselContent>
                      {roomdata.images.map((url: string, index: number) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
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
                    <CarouselPrevious className="hidden sm:flex " />
                    <CarouselNext className="hidden sm:flex" />
                  </Carousel>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="animate__animated animate__fadeInRight">
                <CardHeader className="flex justify-center items-center font-bold">
                  <h1>EDITED DATA</h1>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      id="Email"
                      name="Email"
                      placeholder={user.email}
                      disabled
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder={user.name}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Location">Location</Label>
                    <Input
                      value={Editroomdata.Location}
                      id="Location"
                      name="Location"
                      placeholder="Location of your room"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Price">Price</Label>
                    <Input
                      value={Editroomdata.Price}
                      required
                      id="Price"
                      name="Price"
                      placeholder="Price Per Day"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="picture">Picture</Label>
                    <Input
                      id="picture"
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      required
                    />
                  </div>
                  {blobUrls.length > 0 && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <Carousel
                        plugins={[plugin.current]}
                        className="w-full max-w-xs"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                      >
                        <CarouselContent>
                          {blobUrls.map((url: string, index: number) => (
                            <CarouselItem key={index}>
                              <div className="p-1">
                                <Card>
                                  <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <img
                                      src={url}
                                      alt={`Preview image ${index}`}
                                      className="object-cover w-full h-full rounded"
                                    />
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex " />
                        <CarouselNext className="hidden sm:flex" />
                      </Carousel>
                    </div>
                  )}
                  {Editroomdata.Cloudurl.length > 0 && (
                    <div className="space-y-2 flex flex-col items-center">
                      <Label>Existing Images</Label>
                      <Carousel
                        plugins={[plugin.current]}
                        className="w-full max-w-xs"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                      >
                        <CarouselContent>
                          {Editroomdata.Cloudurl.map(
                            (url: string, index: number) => (
                              <CarouselItem key={index}>
                                <div className="p-1">
                                  <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                      <img
                                        src={url}
                                        alt={`Existing image ${index}`}
                                        className="object-cover w-full h-full rounded cursor-pointer hover:opacity-75"
                                      />
                                    </CardContent>
                                  </Card>
                                </div>
                                <div className="flex justify-center mt-2">
                                  <Button
                                    variant="outline"
                                    className="text-red-500 bg-transparent border border-none hover:bg-red-50"
                                    onClick={() => imagedelete(index)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </CarouselItem>
                            )
                          )}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                      </Carousel>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="Propertyname">Property Name</Label>
                    <Input
                      required
                      value={Editroomdata.Propertyname}
                      id="Propertyname"
                      name="Propertyname"
                      placeholder="Name of your Property"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ContactNumber">Contact Number</Label>
                    <Input
                      value={Editroomdata.ContactNumber}
                      required
                      id="ContactNumber"
                      name="ContactNumber"
                      placeholder="Contact Number"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Nobedroom">No Of Bedrooms</Label>
                    <Select
                      onValueChange={handleSelectChange}
                      required
                      value={Editroomdata.Nobedrooms}
                    >
                      <SelectTrigger id="Nobedroom" name="Nobedroom">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="SingleBedroom">
                          Single Bedroom
                        </SelectItem>
                        <SelectItem value="DoubleBedroom">
                          Double Bedroom
                        </SelectItem>
                        <SelectItem value="MorethanDoubleBedroom">
                          More than Double Bedroom
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center items-center">
                  <Button onClick={updateapi} className="w-full sm:w-auto">
                    Update
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Editroom;
