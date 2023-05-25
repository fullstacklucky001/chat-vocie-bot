import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home/index";
import UserMessage from "./pages/message/user";
import RickMessage from "./pages/message/rick";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="home" element={<Home />} />
      <Route path="user-message" element={<UserMessage />} />
      <Route path="rick-message" element={<RickMessage />} />
    </Routes>
  );
}

export default App;
