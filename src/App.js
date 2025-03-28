// --- START OF FILE App.js ---
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import AdminTripsPage from "./pages/AdminTripsPage"; // Updated import to AdminTripsPage
import TripDetails from "./pages/TripDetails";
import Navbar from "./components/common/Navbar";
import Navbar2 from "./components/common/Navbar2";
import { useEffect, useState } from "react";
import Footer from "./components/common/Footer";
import AccommodationDetailsPage from "./pages/AccommodationDetailsPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import CMSAdminPanel from "./pages/CMSAdminPanel";
import EditAboutUsPage from "./pages/admin/cms/EditAboutUsPage";
import EditContactUsPage from "./pages/admin/cms/EditContactUsPage";
import EditTermsAndConditionsPage from "./pages/admin/cms/EditTermsAndConditionsPage";
import AddTripPage from "./pages/admin/cms/AddTripPage"; // Import AddTripPage
import EditTripPage from "./pages/admin/cms/EditTripPage"; // Import EditTripPage
import { AuthProvider } from "./context/AuthContext";
import AdminLoginPage from "./pages/AdminLoginPage";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import BookingConfirmation from "./components/BookingConfirmation";
import AddAccomodation from "./pages/admin/cms/AddAccomodation";
import Dashboard from "./pages/Dashboard";

import AccommodationsList from "./pages/AccommodationsList";
import EditAccomodation from "./pages/admin/cms/EditAccomodation";
import Accommodations from "./pages/Accommodations";

// Create RequireAuth component
const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) return <CircularProgress />;
  return isAuthenticated ? children : null;
};

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <AuthProvider>
      <div className="App app-container">
        <Router>
          <Navbar />
          {isMobile && <Navbar2 />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/accommodations" element={<Accommodations />} />
            <Route
              path="/admin/cms/trips-list"
              element={
                <RequireAuth>
                  {" "}
                  <AdminTripsPage />{" "}
                </RequireAuth>
              }
            />{" "}
            {/* Updated route path and component */}
            <Route
              path="/trips/:id"
              element={<TripDetails isMobile={isMobile} />}
            />
            <Route
              path="/accommodations/:id"
              element={<AccommodationDetailsPage isMobile={isMobile} />}
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditionsPage />}
            />
            <Route
              path="/admin/cms"
              element={
                <RequireAuth>
                  {" "}
                  <CMSAdminPanel />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/admin/cms/edit/about-us"
              element={
                <RequireAuth>
                  <EditAboutUsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/cms/edit/contact-us"
              element={
                <RequireAuth>
                  <EditContactUsPage />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/admin/cms/edit/terms-and-conditions"
              element={
                <RequireAuth>
                  <EditTermsAndConditionsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/add-accommodation"
              element={
                <RequireAuth>
                  {" "}
                  <AddAccomodation />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/admin/edit-accommodation/:id"
              element={
                <RequireAuth>
                  {" "}
                  <EditAccomodation />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/accommodations"
              element={
                <RequireAuth>
                  <AccommodationsList />
                </RequireAuth>
              }
            />
            {/* ADD ROUTE FOR ADD TRIP PAGE */}
            <Route
              path="/admin/cms/add-trip"
              element={<AddTripPage isMobile={isMobile} />}
            />{" "}
            {/* Pass isMobile prop */}
            <Route path="/admin/edit-trip/:tripId" element={<EditTripPage />} />
            {/* Other routes */}
            <Route
              path="/booking-confirmation"
              element={<BookingConfirmation />}
            />
          </Routes>
          {!isMobile && <Footer />}
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
// --- END OF FILE App.js ---
