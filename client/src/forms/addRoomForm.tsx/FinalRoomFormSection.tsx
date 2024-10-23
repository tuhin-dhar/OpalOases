import { roomNames } from "@/config/hotel-option-config";
import { useFormContext } from "react-hook-form";
import { RoomFormData } from "./AddRoomForm";

const FinalRoomFormSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RoomFormData>();

  return (
    <div className="flex flex-col gap-4 space-y-2">
      <h1 className="text-3xl font-bold">What's the name of this room?</h1>
      <div className="flex flex-col gap-4 space-y-2 border p-10 border-slate-200">
        <span>
          This is the name that guests will see on your property page. Choose a
          name that most accurately describes this room.
        </span>
        <label htmlFor="" className="text-gray-700 text-md font-bold flex-1">
          Room Name <br></br>
          <select
            className="border
          rounded h-10 p-2 text-gray-700 font-normal w-[500px]"
            {...register("roomName", { required: "This field is required" })}
          >
            <option value="" className="text-sm font-bold ">
              Select a room name
            </option>
            {roomNames.map((roomName) => (
              <option value={roomName}>{roomName} </option>
            ))}
          </select>
          {errors.roomName && (
            <span className="text-red-500">{errors.roomName.message}</span>
          )}
        </label>
      </div>
      <h1 className="text-3xl font-bold">
        Set the price per night for this room
      </h1>
      <div className="flex flex-col gap-4 space-y-2 border p-10 border-slate-200">
        <span className="font-bold">
          How much do you want to charge per night?
        </span>
        <label htmlFor="" className="text-gray-700 text-md font-bold flex-1">
          Price guests pay<br></br>
          <input
            type="number"
            min={1}
            className="mt-1 border rounded w-full py-1 px-2 font-normal"
            {...register("pricePerNight", {
              required: "This field is required",
            })}
          />
          {errors.pricePerNight && (
            <span className="text-red-500">{errors.pricePerNight.message}</span>
          )}
        </label>
      </div>
    </div>
  );
};

export default FinalRoomFormSection;
