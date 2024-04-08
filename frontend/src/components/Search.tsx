import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { SearchOptions, searchData } from "../assets/searchData";
import useOutsideClick from "../hooks/useOutsideClick";
import { useSetRecoilState } from "recoil";
import { searchValueAtom, showSearchBarAtom } from "../store/search";
import { useRef } from "react";

export default function ComboBox() {
  const setSearchValue = useSetRecoilState(searchValueAtom);
  const setShowSearchBar = useSetRecoilState(showSearchBarAtom);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setShowSearchBar(false));

  return (
    <div ref={ref}>
      <Autocomplete
        disablePortal
        options={searchData}
        sx={{ width: "50%", mt: 2, mx: "auto" }}
        autoHighlight
        value={null}
        onChange={(_, newValue: SearchOptions | null) => {
          if (newValue) setSearchValue(newValue);
          setShowSearchBar(false);
        }}
        renderInput={(params) => (
          <TextField autoFocus={true} {...params} label="Movie" />
        )}
      />
    </div>
  );
}
