import { FormEvent, useState } from "react";
import { useSearchContext } from "../context/SearchContext";
import { MdOutlineTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const search = useSearchContext();
  const navigate = useNavigate();

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault;
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );

    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const handleClear = () => {
    setDestination("");
    setCheckIn(new Date());
    setCheckOut(new Date());
    setAdultCount(1);
    setChildCount(0);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-5 bg-orange-400 p-2 rounded shadow-md gap-2 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center"
    >
      <div className="flex flex-row flex-1 bg-white p-2">
        <MdOutlineTravelExplore size={25} className="mr-2" />
        <input
          type="text"
          placeholder="Enter Destination"
          className="text-md w-full focus:outline-none"
          value={destination}
          onChange={(event) => {
            setDestination(event.target.value);
          }}
        />
      </div>
      <div className="flex flex-row bg-white px-2 p-1 gap-2">
        <label htmlFor="" className="items-center flex">
          Adults
          <input
            type="number"
            className="w-full p-1 focus:outline-none font-bold"
            min={1}
            max={20}
            value={adultCount}
            onChange={(event) => {
              setAdultCount(parseInt(event.target.value));
            }}
          />
        </label>
        <label htmlFor="" className="items-center flex">
          Children
          <input
            type="number"
            className="w-full p-1 focus:outline-none font-bold"
            defaultValue={0}
            min={0}
            max={20}
            value={childCount}
            onChange={(event) => {
              setChildCount(parseInt(event.target.value));
            }}
          />
        </label>
      </div>
      <div className="">
        <DatePicker
          selected={checkIn}
          onChange={(date) => {
            setCheckIn(date as Date);
          }}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="">
        <DatePicker
          selected={checkOut}
          onChange={(date) => {
            setCheckOut(date as Date);
          }}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="flex flex-row gap-1">
        <button className="rounded w-2/3 p-2 bg-custom hover:bg-customTo font-bold text-white text-xl h-full hover:bg-custom ">
          Search
        </button>
        <button
          onClick={handleClear}
          className="rounded w-1/3 p-2 bg-red-900 font-bold text-white text-xl h-full hover:bg-red-500 "
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
