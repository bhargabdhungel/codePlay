import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../../assets/theme";
import { Button, CssBaseline, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useRecoilValue } from "recoil";
import { loggedInAtom } from "../../store/search";

export default function Home() {
  const navigate = useNavigate();
  const loading = useAuth(true);
  const loggedIn = useRecoilValue(loggedInAtom);
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          {!loading && (
            <div className="flex flex-col gap-6 justify-center items-center w-full">
              <div>
                <h1 className="text-3xl text-pretty select-none">
                  Welcome to codeplay
                </h1>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (loggedIn) navigate("/home", { replace: true });
                    else navigate("/login", { replace: true });
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </Grid>
      </ThemeProvider>
    </>
  );
}
