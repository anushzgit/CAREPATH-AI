
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Navbar from "./Navbar";
import Home from "./pages/Home";
import Hospitals from "./pages/Hospitals";
import SymptomCheckerPage from "./pages/SymptomCheckerPage";
import HealthReportPage from "./pages/HealthReportPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
        <Route path="/health-report" element={<HealthReportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
