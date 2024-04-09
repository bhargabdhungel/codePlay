import { ThemeProvider } from "@mui/material/styles";
import SimpleBackdrop from "../../components/BackDrop";
import { darkTheme } from "../../assets/theme";
import { createRef, useEffect, useRef, useState } from "react";
import { Avatar, Container, CssBaseline, Typography } from "@mui/material";
import Copyright from "../../components/Copyright";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import fetchData, { Method } from "../../helpers/fetchData";
import { fetchResponse } from "./Login";
import { useNavigate } from "react-router-dom";

export default function Verify({ path }: { path: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOTP] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef(otp.map(() => createRef<HTMLInputElement>()));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (focusedIndex < 6) {
      inputRefs.current[focusedIndex].current?.focus();
      setOTP((prev) => {
        const newArr = [...prev];
        for (let i = focusedIndex + 1; i < 6; i++) {
          newArr[i] = "";
        }
        return newArr;
      });
    }
  }, [focusedIndex]);

  useEffect(() => {
    const verifyOTP = async (otpString: string) => {
      setLoading(true);
      try {
        const resp: fetchResponse = await fetchData({
          url: import.meta.env.VITE_API + "/auth/" + path,
          method: Method.POST,
          body: {
            otp: otpString,
            email: localStorage.getItem("email") || null,
          },
        });
        if (resp.message) alert(resp.message);
        if (resp.path) navigate("/" + resp.path);
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert("Check your internet connection");
          return;
        }
        console.log("Error while verifying OTP");
      } finally {
        setLoading(false);
      }
    };
    const otpString = otp.join("");
    if (otpString.length === 6) verifyOTP(otpString);
  }, [otp, navigate, path]);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className="flex justify-center items-center pt-24 flex-col">
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
              OTP Verification
            </Typography>
            <div className="flex bg-gre mt-20 gap-1">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  className="w-16 h-16 rounded-md text-4xl text-center border bg-inherit text-white"
                  type="text"
                  ref={inputRefs.current[index]}
                  value={digit}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      if (index === 0) return;
                      setFocusedIndex(index - 1);
                    }
                    let value = parseInt(e.target.value);
                    if (isNaN(value)) {
                      setOTP((prev) => {
                        const newArr = [...prev];
                        newArr[index] = "";
                        for (let i = index + 1; i < 6; i++) {
                          newArr[i] = "";
                        }
                        return newArr;
                      });
                      return;
                    }
                    if (value > 9) value = value % 10;
                    if (value < 0) value = 0;

                    setOTP((prev) => {
                      const newArr = [...prev];
                      newArr[index] = value.toString();
                      return newArr;
                    });

                    setFocusedIndex(() => {
                      if (e.target.value && index < 5) {
                        return index + 1;
                      } else if (!e.target.value && index > 0) {
                        return index - 1;
                      } else return index;
                    });
                  }}
                />
              ))}
            </div>
          </div>
          <Copyright
            link="https://github.com/bhargabdhungel/codePlay"
            website="CodePlay"
          />
        </Container>
      </ThemeProvider>
      <SimpleBackdrop open={loading} />
    </>
  );
}
