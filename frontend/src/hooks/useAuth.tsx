import { useEffect, useState } from "react";
import fetchData, { Method } from "../helpers/fetchData";
import { useNavigate } from "react-router-dom";
import { fetchResponse } from "../pages/auth/Login";

export default function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getInfo = async () => {
      setLoading(true);
      try {
        const response: fetchResponse = await fetchData({
          method: Method.GET,
          url: import.meta.env.VITE_API + "/auth/me",
          token: localStorage.getItem("token") || "",
        });
        if (response.path) navigate("/" + response.path);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          alert("Check your internet connection");
        } else console.log("Error in login");
        setLoading(false);
      }
    };
    getInfo();
  }, [navigate]);
  return loading;
}
