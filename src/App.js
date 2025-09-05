import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SignedIn, Protect, useUser } from '@clerk/clerk-react';

// Pages
import Home from './pages/Home';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import ThemeTripsPage from './pages/ThemeTripsPage';
import Accommodations from './pages/Accommodations';
import AccommodationDetailsPage from './pages/AccommodationDetailsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';
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
import ManageBookingsPage from './pages/ManageBookingsPage';
import NewsletterSubscribers from './pages/admin/NewsletterSubscribers';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotAuthorized from './pages/NotAuthorized';

// Components
import BottomNavBar from './components/common/BottomNavBar';

const AdminRoutes = () => {
  const { isLoaded, user } = useUser();
  if (!isLoaded) return null; // wait for Clerk to load
  const hasAdminRole = user?.publicMetadata?.role === 'admin';

  const guard = (component) => hasAdminRole ? component : <NotAuthorized />;

  return (
    <Routes>
      <Route path="dashboard" element={guard(<Dashboard />)} />
      <Route path="manage-bookings" element={guard(<ManageBookingsPage />)} />
      <Route path="cms" element={guard(<CMSAdminPanel />)} />
      <Route path="cms/trips-list" element={guard(<AdminTripsPage />)} />
      <Route path="cms/edit/about-us" element={guard(<EditAboutUsPage />)} />
      <Route path="cms/edit/contact-us" element={guard(<EditContactUsPage />)} />
      <Route path="cms/edit/terms-and-conditions" element={guard(<EditTermsAndConditionsPage />)} />
      <Route path="cms/edit/privacy-policy" element={guard(<EditPrivacyPolicyPage />)} />
      <Route path="cms/edit/cookie-policy" element={guard(<EditCookiePolicyPage />)} />
      <Route path="cms/edit/accessibility-statement" element={guard(<EditAccessibilityStatementPage />)} />
      <Route path="add-accommodation" element={guard(<AddAccommodation />)} />
      <Route path="edit-accommodation/:id" element={guard(<EditAccommodation />)} />
      <Route path="accommodations" element={guard(<AccommodationsList />)} />
      <Route path="cms/add-trip" element={guard(<AddTripPage />)} />
      <Route path="edit-trip/:tripId" element={guard(<EditTripPage />)} />
      <Route path="newsletter-subscribers" element={guard(<NewsletterSubscribers />)} />
      <Route path="users" element={guard(<ManageUsersPage />)} />
    </Routes>
  );
};

function App() {
  const appTheme = useTheme();
  const isMobile = useMediaQuery(appTheme.breakpoints.down('md'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/trips/theme/:themeName" element={<ThemeTripsPage />} />
          <Route path="/accommodations/:id" element={<AccommodationDetailsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />

          {/* Sign In / Sign Up Routes */}
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={<SignedIn><UserProfilePage /></SignedIn>}
          />
          <Route
            path="/edit-profile"
            element={<SignedIn><EditProfilePage /></SignedIn>}
          />
          <Route
            path="/change-password"
            element={<SignedIn><ChangePasswordPage /></SignedIn>}
          />

          {/* Admin Protected Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
        {isMobile && <BottomNavBar />}
      </div>
    </ThemeProvider>
  );
}

export default App;
