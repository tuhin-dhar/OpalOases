import { useMutation } from "react-query";
import ManageHotelForm from "../forms/manageHotelForm/ManageHotelForm";
import { useAppContext } from "../context/AppContext";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";

function AddHotel() {
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel listing uploaded", type: "SUCCESS" });
      navigate("/my-hotels");
    },
    onError: () => {
      showToast({ message: "Error creating hotel listing", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
}

export default AddHotel;
