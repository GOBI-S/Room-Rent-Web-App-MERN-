import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { Separator } from "@/components/ui/separator";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useNavigate } from "react-router-dom";

interface RoomData {
  Email: string;
  Name: string;
  Location: string;
  Price: string;
  Propertyname: string;
  ContactNumber: string;
  Nobedrooms: string;
  images: string[]; // Specify images as string[] (array of image URLs)
}
const CreateRoom: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  console.log(user.role)
  const navigate = useNavigate();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const [isallfieldok, setisallfieldok] = useState(false);
  const [isloading, setisloading] = useState(false);
  // const [images, setImages] = React.useState<File[]>([]);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  // console.log(date)
  const [Roomdata, setRoomdata] = useState<RoomData>({
    Email: user.email,
    Name: user.name,
    Location: "",
    Price: "",
    Propertyname: "",
    ContactNumber: "",
    Nobedrooms: "",
    images: [],
  });
  useEffect(() => {
    const allFieldsFilled =
      Roomdata.Location !== "" &&
      Roomdata.Price !== "" &&
      Roomdata.Propertyname !== "" &&
      Roomdata.ContactNumber !== "" &&
      Roomdata.Nobedrooms !== "" &&
      Roomdata.images.length > 0;
    setisallfieldok(allFieldsFilled);
  }, [Roomdata]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRoomdata((prev) => ({
      ...prev,
      [name]: value, // Use name attribute to update the corresponding field in state
    }));
  };
  const handleSelectChange = (value: string) => {
    setRoomdata((prev) => ({
      ...prev,
      Nobedrooms: value,
    }));
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const base64Files: string[] = [];

      // Create a Promise to wait for all images to be read
      const promises = filesArray.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();

          // Read the file as base64
          reader.readAsDataURL(file);

          reader.onloadend = () => {
            if (reader.result) {
              base64Files.push(reader.result as string);
              resolve(reader.result as string); // Resolve when done
            }
          };
        });
      });

      // Wait until all files are processed
      Promise.all(promises).then(() => {
        // Now that all base64 strings are ready, update the state
        const fileURLs = filesArray.map((file) => URL.createObjectURL(file));
        setBlobUrls(fileURLs); // Set object URLs if needed
        setRoomdata((prevRoomdata) => ({
          ...prevRoomdata,
          images: base64Files, // Store base64 strings
        }));
      });
    }
  };

  console.log(Roomdata);

  const Createroom = async () => {
    try {
      setisloading(true);
      const response = await axios.post(
        "http://localhost:5000/Createroom",
        Roomdata,
        { withCredentials: true }
      );
      console.log("Server Response:", response.data);
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
    } finally {
      setisloading(false);
      navigate("/Roomlist");
    }
  };
  useEffect(() => {
    (user.role=="Owner")?"":navigate("/login")
  }, []);

  return (
    <>
      <SidebarProvider>
        <AppSidebar title="Create room" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
          </header>
          <div className="flex m-20 justify-center items-center">
            <Card className="w-[700px]">
              {isloading && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                  <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin z-50"></div>
                </div>
              )}
              <CardHeader>
                <CardTitle>Create Room</CardTitle>
                <CardDescription>Create your new Room .</CardDescription>
              </CardHeader>

              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="Email">Email</Label>
                      <Input
                        id="Email"
                        name="Email"
                        placeholder={user.email}
                        disabled
                        required
                      />
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder={user.name}
                        disabled
                      />
                      <Label htmlFor="Location">Location</Label>
                      <Input
                        id="Location"
                        name="Location"
                        placeholder="Location of yoor room"
                        onChange={handleChange}
                      />
                      <Label htmlFor="Price">Price</Label>
                      <Input
                        required
                        id="Price"
                        name="Price"
                        placeholder="Price Per Day"
                        onChange={handleChange}
                      />
                      <Label htmlFor="picture">Picture</Label>
                      <Input
                        id="picture"
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        required
                      />
                      <div>
                        <div
                          className={`flex flex-col justify-center items-center ${
                            blobUrls.length > 0 ? "" : "hidden"
                          }`}
                        >
                          <div>
                            <Label htmlFor="">Preview</Label>
                          </div>
                          <div>
                            <Carousel
                              plugins={[plugin.current]}
                              className="w-m max-w-xs"
                              onMouseEnter={plugin.current.stop}
                              onMouseLeave={plugin.current.reset}
                            >
                              <CarouselContent className="w-full">
                                {blobUrls.map((url: string, index: number) => (
                                  <CarouselItem key={index}>
                                    <div className="p-1">
                                      <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                          <span className="text-4xl font-semibold">
                                            <img src={`${url}`} />
                                            <div className="flex justify-center align-bottom"></div>
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
                          </div>
                        </div>
                      </div>
                      <Label htmlFor="Propertyname">Property Name</Label>
                      <Input
                        required
                        id="Propertyname"
                        name="Propertyname"
                        placeholder="Name of your Property"
                        onChange={handleChange}
                      />
                      <Label htmlFor="ContactNumber">Contact Number</Label>
                      <Input
                        required
                        id="ContactNumber"
                        name="ContactNumber"
                        placeholder="Contact Number"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="Nobedroom">No Of Bedrooms</Label>
                      <Select onValueChange={handleSelectChange} required>
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
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={Createroom} disabled={!isallfieldok}>
                  Publish
                </Button>
              </CardFooter>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default CreateRoom;
