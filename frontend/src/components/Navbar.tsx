import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../assets/theme";
import { GitHub } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Tooltip } from "@mui/material";
import { showSearchBarAtom, showUserAtom } from "../store/search";

export default function PrimarySearchAppBar() {
  const [showSearchBar, setShowSearchBar] = useRecoilState(showSearchBarAtom);
  const setShowProfile = useSetRecoilState(showUserAtom);
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Tooltip title="Github" placement="left">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{
                  mr: 1,
                }}
                href="https://github.com/bhargabdhungel/codePlay"
                target="_blank"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              CodePlay
            </Typography>
            <Button
              sx={{
                color: "white",
                marginLeft: { xs: 0, sm: 3 },
                textTransform: "none",
                bgcolor: "rgba(255, 255, 255, 0.15)",
              }}
              disabled={showSearchBar}
              onClick={() => {
                setShowSearchBar((prev: boolean) => !prev);
              }}
            >
              <SearchIcon />
              <p className="mx-2">Ctrl Shift F to search ...</p>
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <Tooltip title="Profile" placement="bottom">
                <IconButton
                  color="inherit"
                  onClick={() => setShowProfile(true)}
                >
                  <Avatar sx={{ bgcolor: "white", width: 32, height: 32 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
