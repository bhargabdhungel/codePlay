import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import Copyright from "../../components/Copyright";
import { darkTheme } from "../../assets/theme";
import { useState } from "react";
import fetchData, { Method } from "../../helpers/fetchData";
import { fetchResponse } from "./Login";
import { useNavigate } from "react-router-dom";
import SimpleBackdrop from "../../components/BackDrop";

export default function ForgotPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const resp: fetchResponse = await fetchData({
        method: Method.POST,
        url: import.meta.env.VITE_API + "/auth/forgotPassword",
        body: {
          email: data.get("email"),
          newPassword: data.get("password"),
        },
      });
      if (resp.path) navigate("/" + resp.path);
      if (resp.message) alert(resp.message);
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
      <ThemeProvider theme={darkTheme}>
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
              Reset Password
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
                    label="New Password"
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
                Reset Password
              </Button>
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
