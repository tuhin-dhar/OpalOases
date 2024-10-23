import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SignOutButton from "./SignOutButton";

export default function Header() {
  const { isLoggedin } = useAppContext();
  return (
    <div className="bg-gradient-to-r from-custom to-customTo py-6">
      <div className="container mx-auto flex justify-between pt-2">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to={"/"}>OpalOases</Link>
        </span>
        <span className="flex gap-9">
          {isLoggedin ? (
            <>
              <Link
                className="flex text-white items-center text-custom-600 px-3 font-bold hover:bg-customLight"
                to={"/my-hotels"}
              >
                My Stays
              </Link>
              <Link
                to={"/bookings"}
                className="flex text-white items-center text-custom-600 px-3 font-bold hover:bg-customLight "
              >
                Bookings
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              {" "}
              <Link
                className="flex bg-white items-center text-custom-600 px-3 font-bold hover:bg-gray-200"
                to={"/sign-in"}
              >
                Sign In
              </Link>
              <Link
                to={"/register"}
                className="flex bg-white items-center text-custom-600 px-3 font-bold hover:bg-gray-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
