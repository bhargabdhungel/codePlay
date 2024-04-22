import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { SearchOptions, searchData } from "../assets/searchData";
import { useSetRecoilState } from "recoil";
import { searchValueAtom, showSearchBarAtom } from "../store/search";
import { useRef } from "react";
import useOutsideClick from "../hooks/useOutsideClick";

export default function ComboBox() {
  const setSearchValue = useSetRecoilState(searchValueAtom);
  const setShowSearchBar = useSetRecoilState(showSearchBarAtom);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    setShowSearchBar(false);
  });

  return (
    <div className="w-full md:w-1/2 mx-auto p-6 h-1/6" ref={ref}>
      <Autocomplete
        disablePortal
        options={searchData}
        autoHighlight
        value={null}
        onChange={(_, newValue: SearchOptions | null) => {
          if (newValue) setSearchValue(newValue);
          setShowSearchBar(false);
        }}
        renderInput={(params) => (
          <TextField autoFocus={true} {...params} label="Search" />
        )}
      />
    </div>
  );
}
