import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import Copyright from "../../components/Copyright";
import { defaultTheme } from "../../assets/theme";
import { useState } from "react";
import fetchData, { Method } from "../../helpers/fetchData";
import { fetchResponse } from "./Login";
import { useNavigate } from "react-router-dom";
import SimpleBackdrop from "../../components/BackDrop";

export default function SignUp() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      // Send the data to the server
      const resp: fetchResponse = await fetchData({
        method: Method.POST,
        url: import.meta.env.VITE_API + "/auth/signup",
        body: {
          email: data.get("email"),
          username: data.get("username"),
          password: data.get("password"),
        },
      });
      if (resp.path) navigate("/" + resp.path);
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
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="username"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
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
