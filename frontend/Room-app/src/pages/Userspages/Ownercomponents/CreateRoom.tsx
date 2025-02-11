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
import 'animate.css';

interface RoomData {
  Email: string;
  Name: string;
  Location: string;
  Price: string;
  Propertyname: string;
  ContactNumber: string;
  Nobedrooms: string;
  images: string[]; // Specify images as string[] (array of image URLs)
  Createrid: string;
}

const CreateRoom: React.FC = () => {
  // const URI2="http://localhost:5000";
  // const URI=URI2;
  const URI="https://roomrentweb.gobidev.site";
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const [isallfieldok, setisallfieldok] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  const [Roomdata, setRoomdata] = useState<RoomData>({
    Email: user.email,
    Name: user.name,
    Location: "",
    Price: "",
    Propertyname: "",
    ContactNumber: "",
    Nobedrooms: "",
    images: [],
    Createrid: user.Userid,
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
      [name]: value,
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
        setRoomdata((prevRoomdata) => ({
          ...prevRoomdata,
          images: base64Files,
        }));
      });
    }
  };

  // Function to delete an uploaded image
  const deleteImage = (index: number) => {
    const updatedBlobUrls = blobUrls.filter((_, idx) => idx !== index);
    const updatedImages = Roomdata.images.filter((_, idx) => idx !== index);

    setBlobUrls(updatedBlobUrls);
    setRoomdata((prevRoomdata) => ({
      ...prevRoomdata,
      images: updatedImages,
    }));
  };

  const Createroom = async () => {
    try {
      setisloading(true);
      const response = await axios.post(
        `${URI}/Createroom`,
        Roomdata,
        {
          withCredentials: true,
        }
      );
      console.log("Server Response:", response.data.message);
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
    } finally {
      setisloading(false);
      navigate("/Myrooms");
    }
  };

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
          <div className="flex m-20 justify-center items-center w-full max-w-1xl md:max-w-3xl lg:max-w-4xl xl:max-w-[900px] mx-auto">
            <Card className="w-full max-w-1xl md:max-w-3xl lg:max-w-4xl xl:max-w-[900px] mx-auto">
              {isloading && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                  <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin z-50"></div>
                </div>
              )}
              <CardHeader>
                <CardTitle>Create Room</CardTitle>
                <CardDescription>Create your new Room.</CardDescription>
              </CardHeader>

              <CardContent>
                <form>
                  <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 xl:gap-20">
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
                        onChange={handleChange}
                      />

                      <Label htmlFor="Price">Price</Label>
                      <Input
                        required
                        id="Price"
                        name="Price"
                        onChange={handleChange}
                      />

                      <Label htmlFor="Propertyname">Property Name</Label>
                      <Input
                        required
                        id="Propertyname"
                        name="Propertyname"
                        onChange={handleChange}
                      />

                      <Label htmlFor="ContactNumber">Contact Number</Label>
                      <Input
                        required
                        id="ContactNumber"
                        name="ContactNumber"
                        onChange={handleChange}
                      />

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

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="picture">Picture</Label>
                      <Input
                        id="picture"
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        required
                      />

                      {blobUrls.length > 0 && (
                        <div className="flex flex-col justify-center items-center">
                          <Label>Preview</Label>
                          <Carousel
                            plugins={[plugin.current]}
                            className="w-full max-w-xs"
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                          >
                            <CarouselContent>
                              {blobUrls.map((url, index) => (
                                <CarouselItem key={index}>
                                  <div className="p-1 relative">
                                    <Card>
                                      <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <img
                                          src={url}
                                          className="object-cover w-full h-full rounded-lg"
                                        />
                                      </CardContent>
                                    </Card>
                                  </div>
                                  <Button
                                    variant="outline"
                                    className=" pl-[130px]  m-2 text-red-500 bg-transparent border border-none"
                                    onClick={() => deleteImage(index)}
                                  >
                                    Delete
                                  </Button>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="hidden sm:flex " />
                            <CarouselNext className="hidden sm:flex" />
                          </Carousel>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                <Button variant="outline" className="w-full sm:w-auto" onClick={()=>navigate("/Searchrooms")}>
                  Cancel
                </Button>
                <Button
                  onClick={Createroom}
                  disabled={!isallfieldok}
                  className="w-full sm:w-auto"
                >
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
