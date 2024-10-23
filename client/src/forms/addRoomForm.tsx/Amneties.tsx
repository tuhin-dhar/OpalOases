import { useFormContext } from "react-hook-form";
import { RoomFormData } from "./AddRoomForm";
import { roomAmenities } from "@/config/hotel-option-config";

const Amneties = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<RoomFormData>();

  return (
    <div className="flex flex-col gap-4 space-y-2">
      <h1 className="text-3xl font-bold">Room Amneties</h1>
      <div className="flex flex-col gap-4 space-y-2 border p-10 border-slate-200">
        <span>These are the facilites that will be provided in the room</span>
        <div className="grid grid-cols-5 gap-3">
          {roomAmenities.map((amnety) => (
            <label className="text-sm flex gap-1 text-gray-700 items-center">
              <input
                value={amnety}
                type="checkbox"
                {...register("amneties", {
                  validate: (amneties) => {
                    if (amneties && amneties.length > 0) {
                      return true;
                    } else {
                      return "This field is required";
                    }
                  },
                })}
              />{" "}
              {amnety}
            </label>
          ))}
        </div>
        {errors.amneties && (
          <span className="text-red-500 text-sm font-bold">
            {errors.amneties.message}
          </span>
        )}
      </div>
      ;
    </div>
  );
};

export default Amneties;
