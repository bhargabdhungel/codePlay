import { useRecoilValue } from "recoil";
import useSearchFeature from "../../hooks/useSearchFeature";
import { searchValueAtom, showSearchBarAtom } from "../../store/search";
import Search from "../../components/Search";
import { SearchOptions } from "../../assets/searchData";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Home() {
  useSearchFeature();
  const loading = useAuth();
  const showSearchBar = useRecoilValue(showSearchBarAtom);
  const searchValue = useRecoilValue(searchValueAtom);
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (showSearchBar) return <Search />;
  if (searchValue) {
    if (searchValue == SearchOptions.Home) navigate("/home");
    else if (searchValue == SearchOptions.Logout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }
  return <div>you searched for: {searchValue}</div>;
}
