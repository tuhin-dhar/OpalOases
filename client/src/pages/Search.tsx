import { useQuery } from "react-query";
import { useSearchContext } from "../context/SearchContext";
import * as apiClient from "../api-client";
import React, { useState } from "react";
import SearchResultCard from "../Components/SearchResultCard";
import Pagination from "../Components/Pagination";
import StarRatingFilter from "../Components/StarRatingFilter";
import TypesFilter from "../Components/TypesFilter";
import FacilityFilter from "../Components/FacilityFilter";
import PriceFilter from "../Components/PriceFilter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedFacilities, setSeletedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number>();
  const [sortOption, setSortOption] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedType,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption: sortOption,
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleTypesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const typeInput = event.target.value;

    setSelectedType((prevTypes) =>
      event.target.checked
        ? [...prevTypes, typeInput]
        : prevTypes.filter((type) => type !== typeInput)
    );
  };

  const handleFacilitiesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const facilityInput = event.target.value;

    setSeletedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facilityInput]
        : prevFacilities.filter((facility) => facility !== facilityInput)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-30">
            Filter By:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <TypesFilter
            selectedTypes={selectedType}
            onChange={handleTypesChange}
          />
          <FacilityFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilitiesChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData &&
              (hotelData?.pagination.total == 1
                ? `${hotelData.pagination.total} stay `
                : `${hotelData.pagination.total} stays `)}
            found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rouned-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
          </select>
        </div>
        {hotelData?.data.map((hotel) => (
          <SearchResultCard hotel={hotel} />
        ))}
        <div className="">
          <Pagination
            page={hotelData?.pagination.page || 1}
            pages={hotelData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
