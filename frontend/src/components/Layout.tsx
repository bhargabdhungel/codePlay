import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useSearchFeature from "../hooks/useSearchFeature";
import {
  searchValueAtom,
  showUserAtom,
  showSearchBarAtom,
  loggedInAtom,
} from "../store/search";
import Search from "../components/Search";
import { SearchOptions } from "../assets/searchData";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../assets/theme";
import CustomBackDrop from "./BackDrop";
import JavascriptIcon from "@mui/icons-material/Javascript";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

export default function Layout(props: { children: React.ReactNode }) {
  useSearchFeature();
  const loading = useAuth();
  const showSearchBar = useRecoilValue(showSearchBarAtom);
  const [searchValue, setSearchValue] = useRecoilState(searchValueAtom);
  const navigate = useNavigate();
  const setLoggedIn = useSetRecoilState(loggedInAtom);

  const [showUser, setShowUser] = useRecoilState(showUserAtom);

  console.log("show search bar", showSearchBar);

  useEffect(() => {
    if (!searchValue) return;
    setSearchValue(null);

    if (searchValue == SearchOptions.Logout) {
      localStorage.removeItem("token");
      setLoggedIn(false);
      navigate("/");
    }
    if (searchValue == SearchOptions.JavaScript) navigate("/home/js");
    if (searchValue == SearchOptions.Home) navigate("/home");

    if (searchValue == SearchOptions.User) setShowUser(true);
  }, [searchValue, navigate, setSearchValue, setShowUser, setLoggedIn]);

  return (
    <>
      {!loading && (
        <ThemeProvider theme={darkTheme}>
          <Grid container component="main" sx={{ height: "91vh" }}>
            <CssBaseline />
            {showSearchBar ? <Search /> : props.children}
          </Grid>
          <Drawer
            anchor="right"
            open={showUser}
            onClose={() => {
              setShowUser(false);
            }}
          >
            <Box
              sx={{
                width: 250,
              }}
              role="presentation"
              onClick={() => {
                // setShowProfile(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") setShowUser(false);
              }}
            >
              <List>
                <ListItem key={"JavaScript"} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <JavascriptIcon />
                    </ListItemIcon>
                    <ListItemText primary={"JavaScript"} />
                  </ListItemButton>
                </ListItem>
                {["Profile", "JavaScript", "AI ML", "Web3"].map(
                  (text, index) => (
                    <ListItem key={text} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItemButton>
                    </ListItem>
                  )
                )}
              </List>
              <Divider />
              <List>
                {["Profile", "Trash", "Spam"].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </ThemeProvider>
      )}
      <CustomBackDrop open={loading} />
    </>
  );
}
