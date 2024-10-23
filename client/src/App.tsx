import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import Signin from "./pages/SignIn";
import { useAppContext } from "./context/AppContext";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import HomeLayout from "./layout/HomeLayout";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import Mybookings from "./pages/MyBookings";
import HomePage from "./pages/HomePage";
import VerifyAccountPage from "./pages/VerifyAccountPage";
import AddRoomPage from "./pages/AddRoomPage";
import RoomsPage from "./pages/RoomsPage";
import EditRoomPage from "./pages/EditRoomPage";

export default function App() {
  const { isLoggedin } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/verify-account"
          element={
            <HomeLayout>
              <VerifyAccountPage />
            </HomeLayout>
          }
        />

        <Route
          path="/register"
          element={
            <HomeLayout>
              <Register />
            </HomeLayout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <HomeLayout>
              <Signin />
            </HomeLayout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <HomeLayout>
              <Detail />
            </HomeLayout>
          }
        />

        {isLoggedin && (
          <>
            <Route
              path="/add-hotel"
              element={
                <HomeLayout>
                  <AddHotel />
                </HomeLayout>
              }
            />
            <Route
              path="/add-room/:hotelId"
              element={
                <HomeLayout>
                  <AddRoomPage />
                </HomeLayout>
              }
            />
            <Route
              path="/edit-room/:hotelId/:roomId"
              element={
                <HomeLayout>
                  <EditRoomPage />
                </HomeLayout>
              }
            />
            <Route
              path="/rooms/:hotelId"
              element={
                <HomeLayout>
                  <RoomsPage />
                </HomeLayout>
              }
            />
            <Route
              path="/my-hotels"
              element={
                <HomeLayout>
                  <MyHotels />
                </HomeLayout>
              }
            />
            <Route
              path="/edit-hotel/:hotelId"
              element={
                <HomeLayout>
                  <EditHotel />
                </HomeLayout>
              }
            />
            <Route
              path="/hotel/:hotelId/:roomId/booking"
              element={
                <HomeLayout>
                  <Booking />
                </HomeLayout>
              }
            />
            <Route
              path="/bookings"
              element={
                <HomeLayout>
                  <Mybookings />
                </HomeLayout>
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}
