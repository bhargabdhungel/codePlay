import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "../../assets/theme";
import Copyright from "../../components/Copyright";
import fetchData, { Method } from "../../helpers/fetchData";
import { useState } from "react";
import CustomBackDrop from "../../components/BackDrop";
import { useNavigate } from "react-router-dom";

export interface fetchResponse {
  data?: unknown;
  message?: string;
  path?: string;
}

export default function SignInSide() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    setLoading(true);

    try {
      const response: fetchResponse = await fetchData({
        method: Method.POST,
        url: import.meta.env.VITE_API + "/auth/login",
        body: {
          email,
          password,
        },
      });
      if (response.path) navigate("/" + response.path);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Check your internet connection");
        return;
      }
      console.log("Error in login");
    }
    setLoading(false);
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage:
                "url(https://4kwallpapers.com/images/walls/thumbs_3t/13653.png)",
              backgroundRepeat: "no-repeat",
              // backgroundColor: (t) =>
              //   t.palette.mode === "light"
              //     ? t.palette.grey[50]
              //     : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {loading ? `Signing In` : `Sign In`}
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link
                      sx={{ cursor: "pointer" }}
                      variant="body2"
                      onClick={() => {
                        navigate("/forgotPassword");
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    Don't have an account?{" "}
                    <Link
                      sx={{
                        cursor: "pointer",
                        textDecoration: { xs: "none", sm: "underline" },
                      }}
                      variant="body2"
                      onClick={() => {
                        navigate("/signup");
                      }}
                    >
                      Get started
                    </Link>
                  </Grid>
                </Grid>
                <Copyright
                  link="https://github.com/bhargabdhungel/codePlay"
                  website="CodePlay"
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
      <CustomBackDrop open={loading} />
    </>
  );
}
