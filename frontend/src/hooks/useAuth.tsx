import { useEffect, useState } from "react";
import fetchData, { Method } from "../helpers/fetchData";
import { useNavigate } from "react-router-dom";
import { fetchResponse } from "../pages/auth/Login";
import { useRecoilState } from "recoil";
import { loggedInAtom } from "../store/search";

export default function useAuth(inAuth: boolean = false) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useRecoilState(loggedInAtom);
  useEffect(() => {
    const getInfo = async () => {
      setLoading(true);
      try {
        const response: fetchResponse = await fetchData({
          method: Method.GET,
          url: import.meta.env.VITE_API + "/auth/me",
          token: localStorage.getItem("token") || "",
        });
        console.log(response);
        if (response.status < 300) {
          setLoggedIn(true);
          if (inAuth) navigate("/home");
        } else {
          setLoggedIn(false);
          if (!inAuth) navigate("/");
        }
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          alert("Check your internet connection");
        } else console.log("Error in login");
        setLoading(false);
      }
    };
    if (!loggedIn) getInfo();
  }, [inAuth, loggedIn, navigate, setLoggedIn]);
  return loading;
}
