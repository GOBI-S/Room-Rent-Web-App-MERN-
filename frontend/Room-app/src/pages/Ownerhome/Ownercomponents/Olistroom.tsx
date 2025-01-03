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
import React from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAppSelector } from "@/hooks/redduxhook";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
interface Roomtype {
  Availabledate: {
    from: string;
    to: string;
  };
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
  const navigate=useNavigate()
  const email=useAppSelector((state=>state.user.email))
  const [total, settotal] = useState<Roomtype[]>([]);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  async function Totalroom() {
    try {
      const response= await axios.get("http://localhost:5000/Olistroom",{params: { email }})
      // console.log("respoonsefrom server:",response.data)
      const rooms= await response.data
      settotal(rooms)
    } catch (error) {
      console.error(error)
    }
    
  }
  Totalroom()
  const deleteapi = async (id:any) => {
    const data ={id:id}
    try {
      const response=await axios.delete("http://localhost:5000/Delete",{data:data})
      console.log("from delete api server side",response.data)
      Totalroom()
    } catch (error) {
      console.error(error)
    }
  }
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
          <div className="grid grid-cols-3 gap-5 m-3">
          {total.map((rooms,index) =>(
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
                  <h1 className="font-bold tracking-wide "> Rent Per Day : <span className="hover:tracking-widest">{rooms.Price}</span> </h1>
                    <p>Property Name : {rooms.Propertyname}</p>
                    <p>Place : {rooms.Location}</p>
                    <p>Contact : {rooms.ContactNumber}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="destructive" onClick={()=>{deleteapi(rooms._id)}}>Delete</Button>
                  <Button onClick={()=>navigate(`/Roomlist/${rooms._id}`)}>Edit</Button>
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

