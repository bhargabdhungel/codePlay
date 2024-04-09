import { useRecoilState, useRecoilValue } from "recoil";
import useSearchFeature from "../../hooks/useSearchFeature";
import {
  searchValueAtom,
  showUserAtom,
  showSearchBarAtom,
} from "../../store/search";
import Search from "../../components/Search";
import { SearchOptions } from "../../assets/searchData";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../../assets/theme";
import CustomBackDrop from "../../components/BackDrop";
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

export default function Home() {
  useSearchFeature();
  const loading = useAuth();
  const showSearchBar = useRecoilValue(showSearchBarAtom);
  const [searchValue, setSearchValue] = useRecoilState(searchValueAtom);
  const navigate = useNavigate();

  const [showUser, setShowUser] = useRecoilState(showUserAtom);

  useEffect(() => {
    if (!searchValue) return;
    setSearchValue(null);

    if (searchValue == SearchOptions.Logout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
    if (searchValue == SearchOptions.Home) navigate("/home");

    if (searchValue == SearchOptions.User) setShowUser(true);
  }, [searchValue, navigate, setSearchValue, setShowUser]);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          {showSearchBar ? (
            <Search />
          ) : (
            <div className="flex justify-center items-center w-full">
              <div>
                <h1>Welcome to codeplay</h1>
              </div>
            </div>
          )}
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
              {["Profile", "JavaScript", "AI ML", "Web3"].map((text, index) => (
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
      <CustomBackDrop open={loading} />
    </>
  );
}
