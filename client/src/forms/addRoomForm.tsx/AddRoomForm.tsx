import { Room } from "@/api-client";
import { FormProvider, useForm } from "react-hook-form";
import RoomDetailsSection from "./RoomDetailsSection";
import { useState } from "react";
import FinalRoomFormSection from "./FinalRoomFormSection";
import { FaArrowLeft } from "react-icons/fa";
import ImagesSection from "../manageHotelForm/ImagesSection";
import Amneties from "./Amneties";

export type RoomFormData = {
  hotelId: string;
  roomName: string;
  roomType: string;
  pricePerNight: number;
  numberOfRooms: number;
  bedType: string;
  numberOfBeds: number;
  roomSize?: number;
  adultCount: number;
  childCount: number;
  amneties: string[];
  imageFiles: string[];
};

type Props = {
  room?: Room;
  hotelId: string;
  roomId?: string;
  onSave: (roomFormData: FormData) => void;
  isLoading: boolean;
};

const AddRoomForm = ({ room, hotelId, onSave, isLoading }: Props) => {
  const formMethods = useForm<RoomFormData>();
  const { handleSubmit } = formMethods;

  console.log(room);
  const [page, setPage] = useState<number>(0);
  const pageDisplay = () => {
    if (page == 0) {
      return <RoomDetailsSection />;
    } else if (page == 1) {
      return <FinalRoomFormSection />;
    } else if (page == 2) {
      return <Amneties />;
    } else {
      return <ImagesSection type="ROOM" />;
    }
  };
  const onSubmit = handleSubmit((jsonFormData: RoomFormData) => {
    console.log(jsonFormData);

    const formData = new FormData();
    if (room) {
      formData.append("roomId", room._id);
    }
    formData.append("hotelId", hotelId);
    formData.append("roomName", jsonFormData.roomName);
    formData.append("roomType", jsonFormData.roomType);
    formData.append("pricePerNight", jsonFormData.pricePerNight.toString());
    formData.append("numberOfRooms", jsonFormData.numberOfRooms.toString());

    formData.append(`beds[0][bedType]`, jsonFormData.bedType);
    formData.append(
      `beds[0][numberOfBeds]`,
      jsonFormData.numberOfBeds.toString()
    );

    if (jsonFormData.roomSize) {
      formData.append("roomSize", jsonFormData.roomSize.toString());
    }

    formData.append("adultCount", jsonFormData.adultCount.toString());
    formData.append("childCount", jsonFormData.childCount.toString());

    jsonFormData.amneties.forEach((amnety, index) => {
      formData.append(`amneties[${index}]`, amnety);
    });

    Array.from(jsonFormData.imageFiles).forEach((imageFile) => {
      formData.append("imageFiles", imageFile);
    });

    // Log the contents of formData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form className="space-y-9" onSubmit={onSubmit}>
        <div className="flex flex-col justify-center">
          {pageDisplay()}
          <div className="flex justify-center gap-3 mt-9">
            <button
              disabled={page === 0 || isLoading}
              onClick={(e) => {
                e.preventDefault();
                setPage((prev) => prev - 1);
              }}
              type="button"
              className="border border-custom w-[10] text-white p-2 font-bold hover:bg-customLight text-xl disabled:bg-gray-200"
            >
              <FaArrowLeft className="text-custom" />
            </button>
            <button
              disabled={isLoading}
              onClick={(e) => {
                e.preventDefault();
                if (page === 3) {
                  // Log the final form data when attempting to submit
                  console.log("Submitting form...");
                  onSubmit();
                } else {
                  setPage((prev) => prev + 1);
                }
              }}
              type={page == 3 ? "submit" : "button"}
              className="bg-custom border border-custom w-[200px] text-white p-2 font-bold hover:bg-white hover:border hover:border-custom hover:text-custom text-xl disabled:bg-gray-500"
            >
              {page == 3 ? "Save" : "Continue"}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddRoomForm;
