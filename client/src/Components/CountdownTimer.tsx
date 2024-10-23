import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "@/context/AppContext";

function CountdownTimer() {
  const { showToast } = useAppContext();
  const { mutate } = useMutation(
    "verifyManual",
    apiClient.manualVerificationRequest,
    {
      onSuccess: () => showToast({ message: "OTP sent", type: "SUCCESS" }),
      onError: () =>
        showToast({ message: "Failed to resend OTP", type: "ERROR" }),
    }
  );
  const [timeLeft, setTimeLeft] = useState(120); // 120 seconds for 2 minutes

  let disabled = timeLeft === 0 ? false : true;

  const handleClick = () => {
    setTimeLeft(120);
    mutate();
  };
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <span>
      <span className="font-bold">{formatTime(timeLeft)}</span>
      <Button
        className="bg-customTo m-3"
        disabled={disabled}
        onClick={handleClick}
      >
        Resend OTP
      </Button>
    </span>
  );
}

export default CountdownTimer;
