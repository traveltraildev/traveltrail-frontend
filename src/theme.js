import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Define the color palette using the logo's colors
const palette = {
  primary: {
    main: '#D5614A', // Orange-Red from logo
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#F1CC5A', // Yellow from logo
    contrastText: '#222222',
  },
  info: {
    main: '#6A8E9A', // Muted Blue-Grey from logo
    contrastText: '#ffffff',
  },
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
  },
  text: {
    primary: '#212529',
    secondary: '#6c757d',
  },
  error: { main: '#d32f2f' },
  warning: { main: '#ffa000' },
  success: { main: '#2e7d32' },
};

// Create the theme instance
let theme = createTheme({
  palette: palette,
  spacing: 8,
  shape: {
    borderRadius: 16, // Increased for a softer, more modern look
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          padding: '10px 24px', // Adjusted padding
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
        }),
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#C05640', // A darker shade of the primary color
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid #e0e0e0`,
        },
      },
    },
    MuiTextField: {
        defaultProps: {
            variant: 'outlined',
            fullWidth: true,
        }
    },
    MuiSelect: {
        defaultProps: {
            variant: 'outlined',
            fullWidth: true,
        }
    }
  },
});

// Make typography responsive
theme = responsiveFontSizes(theme);

export default theme;
