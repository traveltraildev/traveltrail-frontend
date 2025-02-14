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
    <div className="App app-container">
      <Router>
        <Navbar />
        {isMobile && <Navbar2 />}
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/trips" element={<Trips />} /> 
           <Route path="/admin/cms/trips-list" element={<AdminTripsPage />} /> {/* Updated route path and component */}
           <Route path="/trips/:id" element={<TripDetails isMobile={isMobile} />} />
          <Route path="/accommodations/:id" element={<AccommodationDetailsPage isMobile={isMobile} />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/admin/cms" element={<CMSAdminPanel />} />
          <Route path="/admin/cms/edit/about-us" element={<EditAboutUsPage />} />
          <Route path="/admin/cms/edit/contact-us" element={<EditContactUsPage />} />
          <Route path="/admin/cms/edit/terms-and-conditions" element={<EditTermsAndConditionsPage />} />
          {/* ADD ROUTE FOR ADD TRIP PAGE */}
          <Route path="/admin/cms/add-trip" element={<AddTripPage isMobile={isMobile} />} /> {/* Pass isMobile prop */}
          </Routes>
        {!isMobile && <Footer />}
      </Router>
    </div>
  );
}

export default App;
// --- END OF FILE App.js ---