import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { GoPersonFill } from "react-icons/go";
import { MdOutlineKingBed } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { Button } from "@/Components/ui/button";

const RoomsPage = () => {
  const { hotelId } = useParams();

  if (!hotelId) {
    return null;
  }

  const { data: rooms } = useQuery("getMyRooms", () =>
    apiClient.getMyRoomsRequest(hotelId as string)
  );

  console.log(rooms);

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Hotel Rooms</h1>
          <h3 className="text-gray-500">
            Add another room to add new layouts, bed options and rates.
          </h3>
        </div>
        <Link
          to={`/add-room/${hotelId}`}
          className="border rounded-xl h-full flex bg-custom text-white text-xl font-bold p-2 hover:bg-customLight"
        >
          Add Room
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {rooms?.map((room) => (
          <div className="border rounded-lg flex flex-col justify-between border-slate-300 p-8 gap-5 hover:shadow-custom-pink">
            <div className="flex">
              <img
                className="mr-3 h-[180px] object-cover border rounded-lg"
                src={room.imageUrls[0] || "clientsrcassetsalt1.webp"}
              />
              <div className="flex flex-col gap-3 w-full">
                <h2 className="text-2xl font-bold">{room.roomName}</h2>
                <div className="flex justify-start gap-3 m-3">
                  <span className="flex items-center gap-3">
                    <GoPersonFill />
                    {room.adultCount} adults, {room.childCount}
                    {room.childCount > 1 ? " children" : " child"} |
                  </span>{" "}
                  <span className="flex items-center gap-3">
                    <MdOutlineKingBed />
                    {room.beds[0].numberOfBeds} {room.beds[0].bedType} |
                  </span>{" "}
                  <span className="flex items-center">
                    <FaRupeeSign className="mr-3" /> Price Per Night:{" "}
                    <span className="font-bold mr-3">
                      {" "}
                      &#8377; {room.pricePerNight}
                    </span>
                    {"  "}|
                    <span className="flex items-center gap-3">
                      <span className="ml-3">
                        Rooms of this type: {room.numberOfRooms}
                      </span>
                    </span>{" "}
                  </span>{" "}
                </div>
                <div className="flex items-center justify-end gap-9">
                  <Button className="bg-red-500 hover:bg-red-300">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomsPage;
