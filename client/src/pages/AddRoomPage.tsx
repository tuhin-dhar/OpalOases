import { useAddMyRoom } from "@/api-client";
import AddRoomForm from "@/forms/addRoomForm.tsx/AddRoomForm";
import { useParams } from "react-router-dom";

const AddRoomPage = () => {
  const { hotelId } = useParams();
  console.log(hotelId);
  const { addRoom, isLoading } = useAddMyRoom();

  const handleSave = (roomFormData: FormData) => {
    addRoom(roomFormData);
    for (let [key, value] of roomFormData.entries()) {
      console.log(key, value);
    }
  };

  if (!hotelId) {
    return "No hotel Id";
  }
  return (
    <AddRoomForm hotelId={hotelId} isLoading={isLoading} onSave={handleSave} />
  );
};

export default AddRoomPage;
