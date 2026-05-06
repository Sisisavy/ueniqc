import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Dashboard from "./pages/Dashboard"; // Use your existing dashboard path
import GuidelinesPage from "./pages/GuidelinesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Everything inside this Route automatically gets your Sidebar and Layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          {/* Add your other paths here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}