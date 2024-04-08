import { useRecoilValue } from "recoil";
import useSearchFeature from "../../hooks/useSearchFeature";
import { searchValueAtom, showSearchBarAtom } from "../../store/search";
import Search from "../../components/Search";
import { SearchOptions } from "../../assets/searchData";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";

export default function Home() {
  useSearchFeature();
  const loading = useAuth();
  const showSearchBar = useRecoilValue(showSearchBarAtom);
  const searchValue = useRecoilValue(searchValueAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchValue) navigate("/home");
    if (searchValue == SearchOptions.Logout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
    if (searchValue == SearchOptions.Home) navigate("/home");
  }, [searchValue, navigate]);

  if (loading) return <div>Loading...</div>;
  if (showSearchBar) return <Search />;
  return <div>you searched for: {searchValue}</div>;
}
