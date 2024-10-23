import { useFormContext } from "react-hook-form";
import { RoomFormData } from "./AddRoomForm";
import { bedTypes, roomTypes } from "@/config/hotel-option-config";

const RoomDetailsSection = () => {
  // const { hotelId } = useParams();
  // const navigate = useNavigate();
  // const handleOnClick = () => {
  //   navigate(`/add-room/${hotelId}/final-details`);
  // };

  const {
    register,
    formState: { errors },
  } = useFormContext<RoomFormData>();

  return (
    <div className="flex flex-col gap-4 space-y-2">
      <h1 className="text-3xl font-bold mb-3">Add Room</h1>
      <div className="flex flex-col gap-4 space-y-2 border p-10 border-slate-200">
        <label className="text-gray-700 text-md font-bold flex-1">
          Which beds are available in this room?<br></br>
          <div className="flex items-center gap-5">
            <select
              {...register("roomType", { required: "this field is required" })}
              className="border
          rounded h-10 p-2 text-gray-700 font-normal w-[500px]"
            >
              {" "}
              <option value="" className="text-sm font-bold ">
                Selet a Room Type
              </option>
              {roomTypes.map((roomType) => (
                <option value={roomType}>{roomType}</option>
              ))}
            </select>
          </div>
          {errors.roomType && (
            <span className="text-red-500">{errors.roomType.message}</span>
          )}
        </label>
        <label
          htmlFor="numberOfRooms"
          className="text-gray-700 text-md font-bold flex-1"
        >
          How many rooms of this type do you have?<br></br>
          <input
            type="number"
            min={1}
            className="mt-1 border rounded w-[90px] py-1 px-2 font-normal"
            {...register("numberOfRooms", {
              required: "This field is required",
            })}
          />
          {errors.numberOfRooms && (
            <span className="text-red-500">{errors.numberOfRooms.message}</span>
          )}
        </label>

        <label className="text-gray-700 text-md font-bold flex-1">
          Which beds are available in this room?<br></br>
          <div className="flex items-center gap-5">
            <select
              {...register("bedType", { required: "this field is required" })}
              className="border
          rounded h-10 p-2 text-gray-700 font-normal w-[500px]"
            >
              {" "}
              <option value="" className="text-sm font-bold ">
                Selet a Rating
              </option>
              {bedTypes.map((bedtype) => (
                <option value={bedtype.name}>
                  {bedtype.name}
                  {bedtype.info}
                </option>
              ))}
              {errors.bedType && (
                <span className="text-red-500">{errors.bedType.message}</span>
              )}
            </select>
            <input
              type="number"
              min={1}
              className=" h-10 border rounded w-[90px] py-1 px-2 font-normal"
              {...register("numberOfBeds", {
                required: "This field is required",
              })}
            />
          </div>
          {errors.numberOfBeds && (
            <span className="text-red-500">{errors.numberOfBeds.message}</span>
          )}
        </label>
        <h1 className="text-xl font-bold">How big is this room?</h1>
        <label className="text-gray-700 text-md font-bold flex-1">
          Room size - optional<br></br>
          <input
            type="number"
            min={1}
            className="border rounded w-[90px] py-1 px-2 font-normal"
            {...register("roomSize", { required: "This field is required" })}
          />{" "}
          sqft.
          {errors.roomSize && (
            <span className="text-red-500">{errors.roomSize.message}</span>
          )}
        </label>
        <div></div>

        <h2 className="text-3xl font-bold mb-3">Guests</h2>
        <div className="grid grid-cols-2 gap-9 bg-customTo">
          <label className=" p-2 font-semibold ml-3 text-gray-700 text-sm">
            Adults
            <input
              type="number"
              min={1}
              className="border rounded w-full mb-3 py-2 px-3 font normal"
              {...register("adultCount", {
                required: "This field is required",
              })}
            />
            {errors.adultCount && (
              <span className="text-sm text-red-500 font-bold">
                {errors.adultCount.message}
              </span>
            )}
          </label>
          <label className="p-2 font-semibold text-gray-700 text-sm mr-3">
            Children
            <input
              type="number"
              min={1}
              className="border rounded w-full py-2 px-3 font normal"
              {...register("childCount", {
                required: "This field is required",
              })}
            />
            {errors.childCount && (
              <span className="text-sm text-red-500 font-bold">
                {errors.childCount.message}
              </span>
            )}
          </label>
        </div>
      </div>
      <div className="flex justify-end"></div>
    </div>
  );
};

export default RoomDetailsSection;
