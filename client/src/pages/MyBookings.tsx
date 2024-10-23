import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Link } from "react-router-dom";

const Mybookings = () => {
  const { data: hotels } = useQuery(
    "fetchMyBookings",
    apiClient.fetchMyBookings
  );

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <span className="text-3xl font-bold">
          No Bookings Found. Become a OpalOases User Today! Book your first
          stay.
          <Link to={"/"}>Click here to see our latest bookigs</Link>
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My bookings</h1>
      {hotels.map((hotel) => (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
          <div className="lg:w-full lg:h-[250px]">
            <img
              src={hotel.imageUrls[0]}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">{hotel.name}</div>
            <div className="text-xs font-normal">
              {hotel.city}, {hotel.country}
            </div>
            {hotel.bookings.map((booking) => (
              <div className="mt-5">
                <div>
                  <span className="font-bold mr-2">Dates: </span>
                  <span>
                    {new Date(booking.checkIn).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    -
                    {new Date(booking.checkOut).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="font-bold mr-2">Guests:</span>

                  <span>
                    {booking.room?.adultCount || 2}{" "}
                    {booking.room?.adultCount === 1 ? "adult" : "adults"},{" "}
                    {booking.room?.childCount || 2} children
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Mybookings;
