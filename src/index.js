import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext'; // Import WishlistProvider

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const ClerkProviderWithRoutes = ({ children }) => {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      appearance={{
        variables: {
          colorPrimary: '#D5614A',
          colorText: '#212529',
        },
        elements: {
          card: { borderRadius: '12px' },
          headerTitle: { fontWeight: 700 },
        },
        layout: {
          logoPlacement: 'top',
        },
        // Use hosted logo from public images
        // Clerk allows setting `logo` at the top-level appearance
        logo: '/images/mainLogo.svg',
      }}
    >
      {children}
    </ClerkProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <ClerkProviderWithRoutes>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </ClerkProviderWithRoutes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

