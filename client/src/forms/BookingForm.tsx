import { useForm } from "react-hook-form";
import { userType } from "../api-client";
import { useSearchContext } from "../context/SearchContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useAppContext } from "../context/AppContext";

type Props = {
  currentUser: userType;
  paymentIntent: apiClient.PaymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  roomId: string;
  totalCost: number;
  paymentIntentId: string;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const { showToast } = useAppContext();
  const search = useSearchContext();
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      hotelId: hotelId,
      roomId: roomId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  const { mutate: bookRoom, isLoading } = useMutation(apiClient.createBooking, {
    onSuccess: () => {
      showToast({ message: "Booking Successful", type: "SUCCESS" });
      navigate("/");
    },
    onError: () => {
      showToast({ message: "Booking Failed", type: "ERROR" });
    },
  });

  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async (formData: BookingFormData) => {
    const result = await stripe?.confirmCardPayment(
      paymentIntent.clientSecret,
      {
        payment_method: {
          card: elements?.getElement(CardElement) as StripeCardElement,
        },
      }
    );

    if (result?.paymentIntent?.status === "succeeded") {
      bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5 h-full"
    >
      <span className="text-3xl font-bold">Confirm your details</span>
      <div className="grid grid-cols-2 gap-6">
        <label htmlFor="" className="text-hray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label htmlFor="" className="text-hray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
      </div>
      <div className="flex flex-1">
        {" "}
        <label htmlFor="" className="text-hray-700 text-sm font-bold flex-1">
          Email
          <input
            type="text"
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>
      <div className="spave-y-2">
        <h2 className="text-xl font-semibold pb-3">Your Price Summary</h2>
        <div className="bg-customTo p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: &#8377; {paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="spave-y-2">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <CardElement
          id="payment-element"
          className="border rounded-md p-2 text-sm"
        />
      </div>
      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-customTo rounded text-white p-2 font-bold disabled:bg-customTo"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
