import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import { AdminAuthProvider } from './context/AdminAuthContext';

// Pagescd ..
import Home from './pages/Home';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Accommodations from './pages/Accommodations';
import AccommodationDetailsPage from './pages/AccommodationDetailsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';
import AdminLoginPage from './pages/AdminLoginPage';
import Dashboard from './pages/Dashboard';
import AdminTripsPage from './pages/AdminTripsPage';
import CMSAdminPanel from './pages/CMSAdminPanel';
import EditAboutUsPage from './pages/admin/cms/EditAboutUsPage';
import EditContactUsPage from './pages/admin/cms/EditContactUsPage';
import EditTermsAndConditionsPage from './pages/admin/cms/EditTermsAndConditionsPage';
import EditPrivacyPolicyPage from './pages/admin/cms/EditPrivacyPolicyPage';
import EditCookiePolicyPage from './pages/admin/cms/EditCookiePolicyPage';
import EditAccessibilityStatementPage from './pages/admin/cms/EditAccessibilityStatementPage';
import AddTripPage from './pages/admin/cms/AddTripPage';
import EditTripPage from './pages/admin/cms/EditTripPage';
import AddAccommodation from './pages/admin/cms/AddAccomodation';
import EditAccommodation from './pages/admin/cms/EditAccomodation';
import AccommodationsList from './pages/AccommodationsList';
import BookingConfirmation from './components/BookingConfirmation';
import UserProfilePage from './pages/UserProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Logout from './pages/Logout';


// Components
import Navbar from './components/common/Navbar';
import Navbar2 from './components/common/Navbar2';
import Footer from './components/common/Footer';


// Context
import RequireAuth from './components/common/RequireAuth';
import { useAuth } from './context/AuthContext';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AdminAuthProvider> {/* Wrap with AdminAuthProvider */}
      <AuthProvider> {/* Wrap with AuthProvider */}
        <Router>
          <div className="App">
            <Navbar />
            {isMobile && <Navbar2 />}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/accommodations" element={<Accommodations />} />
              <Route path="/trips/:id" element={<TripDetails isMobile={isMobile} />} />
              <Route path="/accommodations/:id" element={<AccommodationDetailsPage isMobile={isMobile} />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/admin/login" element={<AdminLoginPage />} /> {/* Admin Login moved to Public Routes */}

              <Route element={<RequireAuth />}>
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/change-password" element={<ChangePasswordPage />} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<RequireAuth isAdmin />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/cms" element={<CMSAdminPanel />} />
                <Route path="/admin/cms/trips-list" element={<AdminTripsPage />} />
                <Route path="/admin/cms/edit/about-us" element={<EditAboutUsPage />} />
                <Route path="/admin/cms/edit/contact-us" element={<EditContactUsPage />} />
                <Route path="/admin/cms/edit/terms-and-conditions" element={<EditTermsAndConditionsPage />} />
                <Route path="/admin/cms/edit/privacy-policy" element={<EditPrivacyPolicyPage />} />
                <Route path="/admin/cms/edit/cookie-policy" element={<EditCookiePolicyPage />} />
                <Route path="/admin/cms/edit/accessibility-statement" element={<EditAccessibilityStatementPage />} />
                <Route path="/admin/add-accommodation" element={<AddAccommodation />} />
                <Route path="/admin/edit-accommodation/:id" element={<EditAccommodation />} />
                <Route path="/admin/accommodations" element={<AccommodationsList />} />
                <Route path="/admin/cms/add-trip" element={<AddTripPage isMobile={isMobile} />} />
                <Route path="/admin/edit-trip/:tripId" element={<EditTripPage />} />
              </Route>
            </Routes>
            {!isMobile && <Footer />}
          </div>
        </Router>
      </AuthProvider>
    </AdminAuthProvider>
 );
}

export default App;