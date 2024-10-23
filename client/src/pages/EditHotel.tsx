import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import ManageHotelForm from "../forms/manageHotelForm/ManageHotelForm";

const EditHotel = () => {
  const { showToast } = useAppContext();
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      navigate("/");
      showToast({ message: "Hotel updated successfully", type: "SUCCESS" });
    },
    onError: () =>
      showToast({ message: "Failed to update hotel", type: "ERROR" }),
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  const { data: hotel } = useQuery(
    "fetchMyHotelById",
    () => apiClient.fetchMyHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
      onError: () =>
        showToast({ message: "Error in fetching hotel", type: "ERROR" }),
    }
  );

  return (
    <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
  );
};

export default EditHotel;
