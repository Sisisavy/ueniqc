import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./applayout";
import Dashboard from "./pages/dashboard"; 
import GuidelinesPage from "./pages/guidelinespage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}