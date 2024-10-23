import AddRoomForm from "@/forms/addRoomForm.tsx/AddRoomForm";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";

const EditRoomPage = () => {
  const { hotelId, roomId } = useParams();

  if (!hotelId || !roomId) {
    return "Address does not exist";
  }

  const { data: room, isLoading } = useQuery("getMyRoom", () =>
    apiClient.getMyRoomRequest(hotelId, roomId)
  );

  console.log(room);

  const handleSubmit = () => {};

  return (
    <AddRoomForm
      hotelId={hotelId}
      roomId={roomId}
      room={room}
      isLoading={isLoading}
      onSave={handleSubmit}
    />
  );
};

export default EditRoomPage;
