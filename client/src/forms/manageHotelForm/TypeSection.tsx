import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-option-config";
import { HotelFormData } from "./ManageHotelForm";

function TypeSection() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();
  const typeWatch = watch("type");

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-3 ">Type</h2>
      <div className="grid grid-cols-5 gap-2">
        {hotelTypes.map((type) => (
          <label
            className={
              typeWatch === type
                ? "cursor-pointer bg-customLight text-white text-sm rounded-full px-4 py-2 font-semibold"
                : "cursor-pointer bg-customGray text-sm rounded-full px-4 py-2 font-semibold"
            }
          >
            <input
              type="radio"
              value={type}
              {...register("type", {
                required: "This is field is required",
              })}
              className="hidden"
            ></input>
            <span className="">{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500 text-sm font-bold">
          {errors.type.message}
        </span>
      )}
    </div>
  );
}

export default TypeSection;
