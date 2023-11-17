// usePinCheck.js
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export const usePinCheck = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL || "";
  const { user } = useAuthContext();

  const pinCheck = async (pin, email) => {
    try {
        console.log("I'm in pinCheck")
        setIsLoading(true);
        setError(null);

        console.log(pin, email);

        const response = await fetch(`${baseUrl}/api/user/pincheck`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`,
            },
            body: JSON.stringify({ pin, email }),
        });


        if (!response.ok) {
            setIsLoading(false);
            setError(response.error);
        }

        if (response.ok) {            
            setIsLoading(false);
            return true
        }
    } catch (error) {
        console.error(error.message);
        setIsLoading(false);
        setError("Something went wrong. Please try again.");
    }
  };

  return { pinCheck, isLoading, error };
};