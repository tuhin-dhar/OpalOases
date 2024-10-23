import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function SignOutButton() {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const mutation = useMutation(apiClient.logout, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("verifyUser");
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Successfully Logged out", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleclick = () => {
    mutation.mutate();
    navigate("/");
  };

  return (
    <button
      onClick={handleclick}
      className="flex bg-white items-center text-custom-600 px-3 font-bold hover:bg-gray-200"
    >
      Logout
    </button>
  );
}

export default SignOutButton;
