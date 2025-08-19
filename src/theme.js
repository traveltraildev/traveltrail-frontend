import { createTheme } from '@mui/material/styles';

// Define the color palette using the structure from your CSS variables
const palette = {
  primary: {
    light: '#ffe082', // Corresponds to --primary-300
    main: '#ffc107',  // Corresponds to --primary-500
    dark: '#ffa000',   // Corresponds to --primary-700
    contrastText: '#222222',
  },
  secondary: {
    light: '#fff59d', // Corresponds to --secondary-300
    main: '#ffeb3b',  // Corresponds to --secondary-500
    dark: '#fbc02d',   // Corresponds to --secondary-700
    contrastText: '#222222',
  },
  accent: {
    main: '#6A8E9A',
    contrastText: '#ffffff',
  },
  neutral: {
    50: '#f5f5f5',
    100: '#f0f0f0',
    200: '#e0e0e0',
    300: '#c0c0c0',
    400: '#a0a0a0',
    500: '#808080',
    600: '#606060',
    700: '#404040',
    800: '#303030',
    900: '#202020',
  },
  background: {
    default: '#f8f9fa', // A slightly off-white for a softer look
    paper: '#ffffff',
  },
  text: {
    primary: '#212529',
    secondary: '#6c757d',
  },
  error: { main: '#d32f2f' },
  warning: { main: '#ffa000' },
  info: { main: '#1976d2' },
  success: { main: '#2e7d32' },
};

// Create the theme instance
const theme = createTheme({
  palette: palette,
  spacing: 8, // 1 unit = 8px
  shape: {
    borderRadius: 8, // Standard border radius
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.75rem' },
    h2: { fontWeight: 700, fontSize: '2.25rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 500, fontSize: '1.25rem' },
    h6: { fontWeight: 500, fontSize: '1.125rem' },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '999px', // Pill-shaped buttons
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          }
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: palette.primary.dark,
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // Softer, larger radius for cards
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: 'none',
                borderBottom: `1px solid ${palette.neutral[200]}`
            }
        }
    }
  },
});

export default theme;