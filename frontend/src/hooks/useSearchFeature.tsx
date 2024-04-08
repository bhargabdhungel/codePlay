import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { showSearchBarAtom } from "../store/search";

export default function useSearchFeature() {
  const setShowSearchBar = useSetRecoilState(showSearchBarAtom);
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "F") {
        setShowSearchBar((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [setShowSearchBar]);
}
