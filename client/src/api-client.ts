import { useMutation } from "react-query";
import { BookingFormData } from "./forms/BookingForm";
import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { useAppContext } from "./context/AppContext";
import { useNavigate } from "react-router-dom";
import { OtpFormType } from "./pages/VerifyAccountPage";

export type PaymentIntentResponse = {
  room: Room;
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};

export type userType = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
};
export type BookingType = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  room: Room;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
};
export type Beds = {
  bedType: string;
  numberOfBeds: number;
};

export type Room = {
  _id: string;
  roomName: string;
  roomType: string;
  pricePerNight: number;
  numberOfRooms: number;
  beds: Beds[];
  roomSize?: number;
  adultCount: number;
  childCount: number;
  anmeties: string[];
  imageUrls: string;
};
export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  rooms: Room[];
  facilities: string[];
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  bookings: BookingType[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCurrentUser = async (): Promise<userType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error in fetching current user");
  }

  return response.json();
};

export async function register(formData: RegisterFormData) {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
}

export async function validateToken() {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token Invlaid");
  }

  return response.json();
}

export async function signIn(formData: SignInFormData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Logout unsuccessfull");
  }
}

export async function addMyHotel(hotelFormData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
}

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching hotel");
  }
  return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      credentials: "include",
      body: hotelFormData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Hotel");
  }

  return response.json();
};

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type Searchparams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childcount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption: string;
};

export const searchHotels = async (
  searchParams: Searchparams
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childcount || "");
  queryParams.append("page", searchParams.page || "");
  queryParams.append("maxPrice", searchParams.maxPrice || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );

  searchParams.types?.forEach((type) => queryParams.append("types", type));

  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  queryParams.append("sortOption", searchParams.sortOption);

  const response = await fetch(
    `${API_BASE_URL}/api/hotels/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`);

  if (!response.ok) {
    throw new Error("Error in fetching hotel");
  }

  return response.json();
};

export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/`);

  if (!response.ok) {
    throw new Error("Error fetching stays");
  }

  return response.json();
};

export const createPaymentIntent = async (
  hotelId: string,
  roomId: string,
  numberOfNights: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/${roomId}/bookings/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfNights }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error creating payment intent");
  }

  return response.json();
};

export const createBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${formData.hotelId}/${formData.roomId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking room");
  }
};

export const fetchMyBookings = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error in fetching bookings");
  }

  return response.json();
};

export const useVerifyAccount = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const verifyAccountRequest = async (data: OtpFormType) => {
    const response = await fetch(`${API_BASE_URL}/api/users/verifyAccount`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error verifying account");
    }

    return response.json();
  };

  const { mutateAsync: enterOtp, isLoading } = useMutation(
    verifyAccountRequest,
    {
      onSuccess: () => {
        showToast({ message: "Account verified", type: "SUCCESS" }),
          navigate("/");
      },
      onError: () =>
        showToast({ message: "Verificatrion Failed", type: "ERROR" }),
    }
  );

  return { enterOtp, isLoading };
};

export const verifyUserRequest = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/verified`, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("User not verified");
  }

  return response.json();
};

export const manualVerificationRequest = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/verifyManual`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error sending request");
  }

  return response.json();
};

export const useAddMyRoom = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const addMyRoomRequest = async (roomFormData: FormData) => {
    for (let [key, value] of roomFormData.entries()) {
      console.log(key, value);
    }
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/add-room/`, {
      method: "POST",

      credentials: "include",
      body: roomFormData,
    });

    if (!response.ok) {
      throw new Error("Error in adding room");
    }

    return response.json();
  };

  const { mutate: addRoom, isLoading } = useMutation(addMyRoomRequest, {
    onSuccess: () => {
      showToast({ message: "Room Added", type: "SUCCESS" }),
        navigate(`/my-hotels`);
    },
    onError: () => showToast({ message: "Failed to add room", type: "ERROR" }),
  });

  return { addRoom, isLoading };
};

export const getMyRoomsRequest = async (hotelId: string): Promise<Room[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/getRooms/${hotelId}`,
    {
      credentials: "include",
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Error in getting rooms");
  }

  return response.json();
};

export const getMyRoomRequest = async (hotelId: string, roomId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/getRoom/${hotelId}/${roomId}`,
    {
      credentials: "include",
      method: "GET",
    }
  );

  if (!response) {
    throw new Error("Failed to fetch room");
  }

  return response.json();
};
