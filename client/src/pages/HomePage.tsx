import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestStayCard from "../Components/LatestStayCard";

const HomePage = () => {
  const { data: hotels } = useQuery("getchHotels", () =>
    apiClient.fetchHotels()
  );

  const topRowHotels = hotels?.slice(0, 2) || [];
  const bottomRowHotels = hotels?.slice(2, 8) || [];

  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Latest Stays</h2>
      <p>Most recents stays added by our hosts</p>
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {topRowHotels.map((hotel) => (
            <LatestStayCard hotel={hotel} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4 grid-cols-1">
          {bottomRowHotels.map((hotel) => (
            <LatestStayCard hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
