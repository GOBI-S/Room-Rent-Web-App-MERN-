import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DynamicBreadcrumb from "@/hooks/brudcrumbhooks";
import { AppSidebar } from "./Sidebar";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import {  useNavigate, useParams } from "react-router-dom";
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
  Delurls:string[]; 
  id:string;// Specify images as string[] (array of image URLs)
}

const Editroom: React.FC = () => {
  const navigate=useNavigate()
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
    Delurls:[],
    id:id ||"",
  });
  useEffect(() => {
    const foo = async () => {
      try {
        const response = await axios.get("http://localhost:5000/Edit", {
          params: { id },
          withCredentials:true,
        });
        const Edit = await response.data;
        setroomdata(Edit);
      } catch (error) {
        console.log(error);
      }
    };
    foo();
  }, [id]);
  useEffect(() => {
    if (roomdata.Email) {
      // Initialize Editroomdata from roomdata only if roomdata is populated
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
  }, [roomdata]); // Runs when roomdata changes
  ///handlechange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditroomdata((prev) => ({
      ...prev,
      [name]: value, // Use name attribute to update the corresponding field in state
    }));
  };
  /// selct change finder
  const handleSelectChange = (value: string) => {
    setEditroomdata((prev) => ({
      ...prev,
      Nobedrooms: value,
    }));
  };
  ///image to bs64 and show to user and store
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
        setEditroomdata((prevEditroomdata) => ({
          ...prevEditroomdata,
          NormalUrl: base64Files, // Store base64 strings
        }));
      });
    }
  };

  const imagedelete = (e: number) => {
    const updatedCloudUrls = [...Editroomdata.Cloudurl];
    if(updatedCloudUrls.length>1){
    setEditroomdata((prevEditroomdata) => ({
      ...prevEditroomdata,
      Delurls:[...(prevEditroomdata.Delurls || []), updatedCloudUrls[e]]
    }));
    
      updatedCloudUrls.splice(e, 1);
  
      // Update the state with the new array
      setEditroomdata((prevEditroomdata) => ({
        ...prevEditroomdata,
        Cloudurl: updatedCloudUrls,
      }));
    }
  };
  const updateapi= async () => {
    try {
      setisloading(true)
      const response=await axios.put("http://localhost:5000/Editeddata",Editroomdata)
      console.log("response from server:", response.data)
      
    } catch (error) {
      console.error(error)
    }
    finally{
      setisloading(false)
      navigate("/Roomlist")
    }
  }

  // useEffect(() => {
  //   console.log("Editroomdata state:", Editroomdata);
  // }, [Editroomdata]);

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
          <div className="grid grid-cols-2  gap-8 m-5">
            <div>
              <Card>
              {isloading && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                  <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                </div>
              )}
                <CardHeader className="flex justify-center items-center font-bold">
                  <h1>ROOM DATA </h1>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center font-medium gap-y-10 tracking-widest">
                  <h1>Email :{roomdata.Email}</h1>
                  <h1>Name :{roomdata.Name}</h1>
                  <h1>Location :{roomdata.Location}</h1>
                  <h1>Price :{roomdata.Price}</h1>
                  <h1>Propertyname :{roomdata.Propertyname}</h1>
                  <h1>ContactNumber:{roomdata.ContactNumber}</h1>
                  <h1>Nobedrooms :{roomdata.Nobedrooms}</h1>
                  <Carousel
                    plugins={[plugin.current]}
                    className="w-m max-w-xs"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                  >
                    <CarouselContent>
                      {roomdata.images.map((url: string, index: number) => (
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
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader className="flex justify-center items-center font-bold">
                  <h1>EDITED DATA</h1>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
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
                    value={Editroomdata.Location}
                    id="Location"
                    name="Location"
                    placeholder="Location of yoor room"
                    onChange={handleChange}
                  />
                  <Label htmlFor="Price">Price</Label>
                  <Input
                    value={Editroomdata.Price}
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
                  <div
                    className={`flex flex-col justify-center items-center 
                      ${blobUrls.length > 0 ? "" : "hidden"}`}
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
                  <div
                    className={`flex justify-center items-center ${
                      Editroomdata.Cloudurl.length > 0 ? "" : "hidden"
                    }`}
                  >
                    <Carousel
                      plugins={[plugin.current]}
                      className="w-m max-w-xs"
                      onMouseEnter={plugin.current.stop}
                      onMouseLeave={plugin.current.reset}
                    >
                      <CardDescription>
                        <h1 className="font-normal">
                          <span className="font-medium text-blue-500">
                            Note!{" "}
                          </span>
                          if you want to delete an image Click the image
                          Otherwise Use Arrow to change
                        </h1>
                      </CardDescription>

                      <CarouselContent>
                        {Editroomdata.Cloudurl.map(
                          (url: string, index: number) => (
                            <CarouselItem key={index}>
                              <div className="p-1">
                                <Card>
                                  <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">
                                      <img
                                        src={`${url}`}
                                        onClick={() => {
                                          imagedelete(index);
                                        }}
                                      />
                                    </span>
                                  </CardContent>
                                </Card>
                              </div>
                            </CarouselItem>
                          )
                        )}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>

                  <Label htmlFor="Propertyname">Property Name</Label>
                  <Input
                    required
                    value={Editroomdata.Propertyname}
                    id="Propertyname"
                    name="Propertyname"
                    placeholder="Name of your Property"
                    onChange={handleChange}
                  />
                  <Label htmlFor="ContactNumber">Contact Number</Label>
                  <Input
                    value={Editroomdata.ContactNumber}
                    required
                    id="ContactNumber"
                    name="ContactNumber"
                    placeholder="Contact Number"
                    onChange={handleChange}
                  />
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="Nobedroom">No Of Bedrooms</Label>
                    <Select
                      onValueChange={handleSelectChange}
                      required
                      value={roomdata.Nobedrooms}
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
                  <Button onClick={updateapi}>Update</Button>
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
