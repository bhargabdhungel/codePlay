import { Routes, Route} from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";

export default function App() : JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      {/* <Route path="/forgotPassword" element={<ForgotPassword />} /> */}
    </Routes>
  );
}