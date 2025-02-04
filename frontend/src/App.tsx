import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Threats from "./pages/Threats";
import Logs from "./pages/Logs";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/threats" element={<Threats />} />
        <Route path="/logs" element={<Logs />} />
      </Route>
    </Routes>
  );
}
