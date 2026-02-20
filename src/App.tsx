import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SensorDetails from "./pages/SensorDetails";
import TractorListing from "./pages/TractorListing";
import TractorRegistration from "./pages/TractorRegistration";
import RentTractor from "./pages/RentTractor";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/sensors" element={<SensorDetails />} />
                  <Route path="/tractors" element={<TractorListing />} />
                  <Route path="/register" element={<TractorRegistration />} />
                  <Route path="/rent/:id" element={<RentTractor />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
