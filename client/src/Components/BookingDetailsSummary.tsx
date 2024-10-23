import { HotelType, PaymentIntentResponse } from "../api-client";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType;
  paymentIntent: PaymentIntentResponse;
};

const BookingDetailsSummary = ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) => {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div className=" border-b py-2">
        <div className="border-b py-2">
          {" "}
          Hotel: <div className="font-bold">{hotel.name}</div>
        </div>
        Location:{" "}
        <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
      </div>
      <div className="flex justify-between">
        <div>
          Check-in
          <div className="font-bold">{checkIn.toDateString()}</div>
        </div>
        <div>
          Check-out
          <div className="font-bold">{checkOut.toDateString()}</div>
        </div>
      </div>
      <div className="border-t border-b py-2">
        Toatl lenght of stay:
        <div className="font-bold">{numberOfNights} Nights</div>
      </div>
      <div>
        Guests
        <div className="font-bold">
          {adultCount} {adultCount === 1 ? "adult" : "adults"} & {childCount}{" "}
          {childCount === 0 || 1 ? "child" : "children"}
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsSummary;
