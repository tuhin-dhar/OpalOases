import { FormProvider, useForm } from "react-hook-form";
import HotelsDetailsSection from "./HotelDetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../api-client";
import { useEffect } from "react";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  starRating: number;
  facilities: string[];
  imageFiles: string[];
  imageUrls: string[];
};

type Props = {
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
  hotel?: HotelType;
};

function ManageHotelForm({ hotel, onSave, isLoading }: Props) {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    reset(hotel);
  }, [reset, hotel]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    console.log(formDataJson);
    const formData = new FormData();

    if (hotel) {
      formData.append("hotelId", hotel._id);
    }

    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("starRating", formDataJson.starRating.toString());

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    onSave(formData);
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-9 ">
        <HotelsDetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <ImagesSection type="HOTEL" />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-custom text-white p-2 font-bold hover:bg-customLight text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
}

export default ManageHotelForm;
