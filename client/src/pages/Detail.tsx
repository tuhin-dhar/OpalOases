import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { RiStarSFill } from "react-icons/ri";

import * as apiClient from "../api-client";
import GuestInfoForm from "../forms/GuestInfoForm";

const Detail = () => {
  const { hotelId } = useParams();

  const { data: hotel } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById((hotelId as string) || ""),
    {
      enabled: !!hotelId,
    }
  );
  console.log(hotel);

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div className="">
        <span className="flex">
          {Array.from({ length: hotel.starRating }).map(() => (
            <RiStarSFill className="fill-yellow-400" />
          ))}
        </span>
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {hotel.imageUrls.map((image) => (
          <img
            src={image}
            alt={hotel.name}
            className="rounded-md w-full h-full object-cover object-center"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-md p-3 hover:bg-customLight hover:text-white">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit"></div>
      </div>
      <GuestInfoForm rooms={hotel.rooms} hotelId={hotel._id} />
    </div>
  );
};

export default Detail;
