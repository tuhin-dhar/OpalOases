import { Room } from "@/api-client";
import { FaRupeeSign } from "react-icons/fa";
import { GoPersonFill } from "react-icons/go";
import { MdOutlineKingBed } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { IoMdResize } from "react-icons/io";
import { useAppContext } from "@/context/AppContext";

import ImageSlider from "react-simple-image-slider";
import { useState } from "react";
import "./slider.css";

type Props = {
  rooms: Room[];
};

const RoomDetails = ({ rooms }: Props) => {
  const { verified } = useAppContext();

  const { hotelId } = useParams();

  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);

  const onClickHandler = (images: string) => () => {
    //@ts-ignore
    setSliderImages(images);
    setSliderOpen(true);
  };

  const closeSlider = () => {
    setSliderOpen(false);
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {rooms?.map((room) => (
        <div className="border bg-white rounded-lg flex flex-col justify-between border-slate-300 p-8 gap-5 hover:shadow-custom-pink">
          <div className="flex">
            <img
              onClick={onClickHandler(room.imageUrls)}
              className="mr-3 h-[150px] object-cover border rounded-lg"
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
                    <span className="flex items-center gap-3 ml-3">
                      <IoMdResize /> Room Size: {room.roomSize}sqft
                    </span>
                  </span>{" "}
                </span>{" "}
              </div>
              <div className="flex items-center justify-end gap-9">
                {room.numberOfRooms === 0 ? (
                  <Link
                    className="border rounded-xl bg-customLight text-white text-xl font-bold p-2"
                    to={``}
                  >
                    Sold Out
                  </Link>
                ) : (
                  <Link
                    className="border rounded-xl bg-custom text-white text-xl font-bold p-2 hover:bg-customLight"
                    to={
                      verified
                        ? `/hotel/${hotelId}/${room._id}/booking`
                        : `/verify-account`
                    }
                  >
                    {verified ? "Book Room" : "Verify Account to book room"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {sliderOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <ImageSlider
              width={1000}
              height={600}
              images={sliderImages.map((url) => ({ url }))}
              showBullets={true}
              showNavs={true}
            />
            <button
              onClick={closeSlider}
              className="absolute top-0 right-0 m-4 p-2 bg-white rounded-full"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
