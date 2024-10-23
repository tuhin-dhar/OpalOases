import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../context/SearchContext";
import { useAppContext } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import RoomDetails from "@/Components/RoomDetails";
import { Room } from "@/api-client";
import { Button } from "@/Components/ui/button";

type Props = {
  rooms: Room[];
  hotelId: string;
};

export type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

const GuestInfoForm = ({ rooms }: Props) => {
  const search = useSearchContext();
  const { isLoggedin, showToast } = useAppContext();
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
    },
  });

  const navigate = useNavigate();
  const location = useLocation();

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const minDate = new Date();
  const maxDate = new Date();

  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate("/sign-in", { state: { from: location } });
  };

  const onSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );

    showToast({ message: "Dates Confirmed", type: "SUCCESS" });
  };

  return (
    <div className="flex flex-col p-4 bg-customTo gap-4">
      <h2 className="text-white font-bold text-2xl">Select Booking Details</h2>
      <form
        onSubmit={
          isLoggedin ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div className="flex w-full gap-3">
            <div className="w-full">
              {" "}
              <DatePicker
                selected={checkIn}
                onChange={(date) => {
                  setValue("checkIn", date as Date);
                }}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={minDate}
                placeholderText="Check-in Date"
                className="min-w-full bg-white p-2 focus:outline-none"
                wrapperClassName="min-w-full"
              />
            </div>
            <div className="w-full">
              <DatePicker
                selected={checkOut}
                onChange={(date) => setValue("checkOut", date as Date)}
                selectsStart
                minDate={minDate}
                maxDate={maxDate}
                startDate={checkIn}
                endDate={checkOut}
                placeholderText="Check-Out Date"
                className="min-w-full p-2 focus:outline-none"
                wrapperClassName="min-w-full"
              />
            </div>
            <Button
              type="submit"
              onClick={() => onSubmit}
              className="bg-custom font-bold rounded-lg hover:bg-purple-500"
            >
              Confirm Dates
            </Button>
          </div>

          <div className="flex flex-row bg-white px-2 p-1 gap-3">
            <label htmlFor="" className="items-center flex w-full">
              Adults
              <input
                type="number"
                className="w-full p-1 focus:outline-none font-bold"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label htmlFor="" className="items-center flex w-full">
              Children
              <input
                type="number"
                defaultValue={search.childCount}
                className="w-full p-1 focus:outline-none font-bold"
                min={0}
                max={20}
                onChange={(event) => {
                  setValue("childCount", parseInt(event.target.value));
                }}
                {...(register("childCount"),
                {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>
          {isLoggedin ? (
            <RoomDetails rooms={rooms} />
          ) : (
            <Button
              className="bg-custom hover:bg-purple-500"
              type="submit"
              onClick={() => onSignInClick}
            >
              Sign in to View Rooms
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;
