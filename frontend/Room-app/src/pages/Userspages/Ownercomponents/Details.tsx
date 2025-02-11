import { useNavigate, useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";

interface RoomDetails {
  Email: string;
  Name: string;
  Location: string;
  Price: string;
  Propertyname: string;
  ContactNumber: string;
  Nobedrooms: string;
  images: string[];
}

const Details = () => {
  const navigate = useNavigate();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const { id } = useParams<{ id: string }>();
//   const URI2 = "http://localhost:5000";
//   const URI = URI2;
  const URI="https://roomrentweb.gobidev.site";
  const [detailsOfRoom, setDetailsOfRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (roomId: string) => {
    try {
      const response = await axios.get(`${URI}/bookingroomdata`, {
        withCredentials: true,
        params: { id: roomId },
      });
      setDetailsOfRoom(response.data);
    } catch (error) {
      console.error("Error fetching room details:", error);
      setError("Failed to fetch room details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData(id);
  }, [id]);

  if (loading) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!detailsOfRoom) {
    return <div className="text-center mt-10">No room details found.</div>;
  }

  return (
    <Card className="animate__animated animate__fadeInLeft">
      <Button
        variant="destructive"
        className="mt-[25px] ml-[25px] hover:bg-red-50"
        onClick={() => navigate("/Mybooking")}
      >
        Back
      </Button>
      <CardHeader className="flex justify-center items-center font-bold">
        <h1>ROOM DATA</h1>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center font-medium gap-y-10 tracking-widest">
        <h1>Email: {detailsOfRoom.Email}</h1>
        <h1>Name: {detailsOfRoom.Name}</h1>
        <h1>Location: {detailsOfRoom.Location}</h1>
        <h1>Price: {detailsOfRoom.Price}</h1>
        <h1>Propertyname: {detailsOfRoom.Propertyname}</h1>
        <h1>ContactNumber: {detailsOfRoom.ContactNumber}</h1>
        <h1>Nobedrooms: {detailsOfRoom.Nobedrooms}</h1>
        {detailsOfRoom.images && detailsOfRoom.images.length > 0 ? (
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-xs"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {detailsOfRoom.images.map((url: string, index: number) => (
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
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        ) : (
          <p>No images available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Details;
