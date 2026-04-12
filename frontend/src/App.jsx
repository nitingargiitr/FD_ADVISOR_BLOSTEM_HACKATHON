import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";
import Glossary from "./pages/Glossary.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/glossary" element={<Glossary />} />
    </Routes>
  );
}
