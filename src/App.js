import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home/index";
import Prompt from "./pages/prompt/index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="home" element={<Home />} />
      <Route path="prompt" element={<Prompt />} />
    </Routes>
  );
}

export default App;
