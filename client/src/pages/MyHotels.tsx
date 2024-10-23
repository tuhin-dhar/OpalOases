import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { FaMapLocation } from "react-icons/fa6";
import { FaHotel } from "react-icons/fa6";
import { MdOutlineHotel } from "react-icons/md";
import { TbStars } from "react-icons/tb";

const MyHotels = () => {
  const { showToast } = useAppContext();

  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => {
        showToast({ message: "Error fetching Hotels", type: "ERROR" });
      },
    }
  );

  if (!hotelData || hotelData.length === 0) {
    return (
      <div className="space-y-5">
        <span className="flex justify-end">
          <Link
            to={"/add-hotel"}
            className="border rounded-xl  flex bg-custom text-white text-xl font-bold p-2 hover:bg-customLight"
          >
            Add Hotel
          </Link>
        </span>
        <div className="flex items-center justify-center">
          <span className="text-3xl font-bold">
            No Stays Found. Become a OpalOases Host Today! <br></br>
            <span className="flex justify-center">Click on Add Hotel</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Stays</h1>
        <Link
          to={"/add-hotel"}
          className="border rounded-xl  flex bg-custom text-white text-xl font-bold p-2 hover:bg-customLight"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div className="border rounded-lg flex flex-col justify-between broder-slate-300 p-8 gap-5 hover:shadow-pink-uniform">
            <div className="flex">
              <img
                className="mr-3 object-cover border rounded-lg"
                src={hotel.imageUrls[0]}
              />
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-bold">{hotel.name}</h2>
                <div className="whitespace-pre-line">
                  {hotel.description.length > 500
                    ? hotel.description.substring(0, 600) + "..."
                    : hotel.description}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="border border-slate-300 rounded-lg p-3 flex  gap-3 items-center hover:bg-customLight">
                <FaMapLocation />
                {hotel.city}, {hotel.country}
              </div>

              <div className="border border-slate-300 rounded-lg p-3 flex  gap-3 items-center hover:bg-customLight">
                <FaHotel />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-lg p-3 flex  gap-3 items-center hover:bg-customLight">
                <MdOutlineHotel />
                {hotel.rooms.length > 0
                  ? ` ${hotel.rooms[0].adultCount} adults,
              ${hotel.rooms[0].childCount} childrens`
                  : `Add rooms to see the occupancy count`}
              </div>
              <div className="border border-slate-300 rounded-lg p-3 flex  gap-3 items-center hover:bg-customLight">
                <TbStars /> {hotel.starRating}{" "}
                {hotel.starRating === 1 ? "star" : "stars"}
              </div>
            </div>
            <span className="flex justify-end gap-5">
              <Link
                className="border rounded-xl flex bg-custom text-white text-xl font-bold p-2 hover:bg-customLight"
                to={`/rooms/${hotel._id}`}
              >
                View Rooms
              </Link>
              <Link
                className="border rounded-xl flex bg-custom text-white text-xl font-bold p-2 hover:bg-customLight"
                to={`/edit-hotel/${hotel._id}`}
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
