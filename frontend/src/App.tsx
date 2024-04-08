import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";
import Verify from "./pages/auth/Verify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Home from "./pages/user/Home";
import Navbar from "./components/Navbar";

// function Home() {
//   return (
//     <Routes path="/*" element={<Home />} >
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<SignUp />} />
//       <Route path="/forgotPassword" element={<ForgotPassword />} />
//       <Route path="/verifyEmail" element={<Verify path="verifyEmail" />} />
//       <Route path="/resetPassword" element={<Verify path="resetPassword" />} />
//     </Routes>

//   );
// }

function HomeRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<HomeRoutes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/verifyEmail" element={<Verify path="verifyEmail" />} />
      <Route path="/resetPassword" element={<Verify path="resetPassword" />} />
    </Routes>
  );
}
