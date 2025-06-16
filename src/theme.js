import { createTheme } from '@mui/material/styles';

// Define the color palette
const palette = {
  primary: {
    main: '#D5614A',
    contrastText: '#222222', // Changed from '#ffffff'
    dark: '#C04A34', // Existing
    light: '#E48C7A', // Added or ensure it exists
  },
  secondary: {
    main: '#F1CC5A',
    contrastText: '#222222',
    light: '#F6DEA3', // Added or ensure it exists
    dark: '#DAB74F',  // Existing or ensure it exists
  },
  accent: {
    main: '#6A8E9A',
    contrastText: '#ffffff',
    light: '#8FB0BB', // Added or ensure it exists
    dark: '#50707A',  // Added or ensure it exists
  },
  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  text: {
    primary: '#222222',
    secondary: '#555555', // A slightly lighter shade for secondary text
  },
  action: { // Added this action object
    hover: 'rgba(0, 0, 0, 0.04)', // A common default MUI hover opacity
    selected: 'rgba(0, 0, 0, 0.08)', // A common default MUI selected opacity
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(0, 0, 0, 0.12)'
  }
};

// Define typography
const typography = {
  fontFamily: [
    'Circular STD', // Primary font
    'Inter',        // Fallback font
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  fontSize: 16, // Base font size
  h1: { fontWeight: 700, fontSize: '2.5rem' }, // Example heading styles
  h2: { fontWeight: 700, fontSize: '2rem' },
  h3: { fontWeight: 600, fontSize: '1.75rem' },
  h4: { fontWeight: 600, fontSize: '1.5rem' },
  h5: { fontWeight: 500, fontSize: '1.25rem' },
  h6: { fontWeight: 500, fontSize: '1.125rem' },
  button: {
    textTransform: 'none', // As per minimalist aesthetic, avoid ALL CAPS buttons
    fontWeight: 600,
  }
};

// Define spacing (for 8px grid system)
const spacing = 8; // MUI spacing unit, 1 spacing unit = 8px

// Define shadows
const shadows = [
  'none',
  '0 1px 2px rgba(0,0,0,0.08)', // Custom subtle shadow for elevation 1
  '0 2px 4px rgba(0,0,0,0.08)',
  '0 3px 6px rgba(0,0,0,0.08)',
  '0 4px 8px rgba(0,0,0,0.08)',
  '0 5px 10px rgba(0,0,0,0.08)',
  '0 6px 12px rgba(0,0,0,0.08)',
  '0 7px 14px rgba(0,0,0,0.08)',
  '0 8px 16px rgba(0,0,0,0.08)',
  '0 9px 18px rgba(0,0,0,0.08)',
  '0 10px 20px rgba(0,0,0,0.08)',
  '0 11px 22px rgba(0,0,0,0.08)',
  '0 12px 24px rgba(0,0,0,0.08)',
  '0 13px 26px rgba(0,0,0,0.08)',
  '0 14px 28px rgba(0,0,0,0.08)',
  '0 15px 30px rgba(0,0,0,0.08)',
  '0 16px 32px rgba(0,0,0,0.08)',
  '0 17px 34px rgba(0,0,0,0.08)',
  '0 18px 36px rgba(0,0,0,0.08)',
  '0 19px 38px rgba(0,0,0,0.08)',
  '0 20px 40px rgba(0,0,0,0.08)',
  '0 21px 42px rgba(0,0,0,0.08)',
  '0 22px 44px rgba(0,0,0,0.08)',
  '0 23px 46px rgba(0,0,0,0.08)',
  '0 24px 48px rgba(0,0,0,0.08)',
];

const theme = createTheme({
  palette: palette,
  typography: typography,
  spacing: spacing,
  shadows: shadows,
  components: {
    MuiButtonBase: { // Targets buttons, icon buttons, etc.
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${palette.accent.main}`, // Using accent color
            outlineOffset: '2px',
            // For high contrast mode in Windows, outlines might be system-colored.
            // This explicit outline should generally work.
          }
        }
      }
    },
    MuiButton: {
      // ... (existing MuiButton styleOverrides)
      // We can also add it here if MuiButtonBase doesn't cover all cases or needs specificity
      styleOverrides: {
        // Ensure existing root, containedPrimary etc. are preserved
        // ...
        root: {
          minHeight: '44px',
          borderRadius: '4px',
          transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          // Adding focus-visible here too, in case MuiButtonBase is too generic
          // or its styles are overridden by MuiButton's own root styles.
          '&:focus-visible': {
            outline: `2px solid ${palette.accent.main}`,
            outlineOffset: '2px',
          }
        },
        containedPrimary: {
          backgroundColor: palette.primary.main,
          color: palette.primary.contrastText,
          '&:hover': {
            backgroundColor: palette.primary.dark, // Assumes you might want a darker shade on hover
            boxShadow: shadows[2], // Optional: add a bit more shadow on hover
            transform: 'scale(1.05)',
          },
        },
        containedSecondary: { // For secondary Call-to-Action buttons
          backgroundColor: palette.secondary.main,
          color: palette.secondary.contrastText,
          '&:hover': {
            backgroundColor: palette.secondary.dark, // Assumes you might want a darker shade on hover
            boxShadow: shadows[2],
            transform: 'scale(1.05)',
          },
        },
        outlinedPrimary: {
          borderColor: palette.primary.main,
          color: palette.primary.main,
          '&:hover': {
            backgroundColor: 'rgba(213, 97, 74, 0.08)', // Light primary background on hover
            borderColor: palette.primary.dark,
            color: palette.primary.dark,
            transform: 'scale(1.05)',
          },
        },
        outlinedSecondary: {
          borderColor: palette.secondary.main,
          color: palette.secondary.main,
          '&:hover': {
            backgroundColor: 'rgba(241, 204, 90, 0.08)', // Light secondary background on hover
            borderColor: palette.secondary.dark,
            color: palette.secondary.dark,
            transform: 'scale(1.05)',
          },
        },
        textPrimary: {
          color: palette.primary.main,
          '&:hover': {
            backgroundColor: 'rgba(213, 97, 74, 0.08)', // Light primary background on hover
            transform: 'scale(1.05)',
          },
        },
        textSecondary: {
          color: palette.secondary.main,
          '&:hover': {
            backgroundColor: 'rgba(241, 204, 90, 0.08)', // Light secondary background on hover
            transform: 'scale(1.05)',
          },
        },
        // ... (rest of MuiButton styleOverrides from previous state are assumed to be here)
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${palette.accent.main}`,
            outlineOffset: '2px',
            borderRadius: '2px', // Slight rounding for the outline on links
          }
        }
      }
    },
    MuiTextField: { // For input fields
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { // Targeting the actual input container
            '&.Mui-focused:focus-visible .MuiOutlinedInput-notchedOutline': { // When focused by keyboard
              borderColor: palette.accent.main, // Change border color
              borderWidth: '2px', // Make it more prominent
            },
            // Ensure a clear visual cue even if not using :focus-visible specific selector here
            // The default MUI behavior for :focus on TextField is usually good,
            // but making the focused border use accent color if not already
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.accent.main, // Use accent color for focused border
            },
          }
        }
      }
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${palette.accent.main}`,
            outlineOffset: '-2px', // Negative offset to keep outline inside, common for bottom nav
            backgroundColor: palette.action.hover, // Add a background change for better visibility
          }
        }
      }
    },
    MuiTab: { // If tabs are used
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: `2px solid ${palette.accent.main}`,
            outlineOffset: '-2px',
            backgroundColor: palette.action.hover,
          }
        }
      }
    },
    MuiCard: { // For cards, if they are made focusable (e.g. for selection)
      styleOverrides: {
        root: {
          borderRadius: '12px',
          // If cards can be focusable (e.g., if they are links or part of a selection)
          // This is less common for a whole card to be focusable unless it acts as a single large button.
          // '&:focus-visible': {
          //   outline: `2px solid ${palette.accent.main}`,
          //   outlineOffset: '2px',
          // }
        },
      },
    },
    // Potentially add other Mui components that are interactive:
    // MuiCheckbox, MuiRadio, MuiSlider, MuiIconButton, MuiListItemButton, etc.
    // For many of these, MUI's default focus ripple or state change might be sufficient,
    // but a consistent outline is often better for accessibility.
    // For now, starting with ButtonBase, Button, Link, TextField, BottomNavigationAction, Tab.
  },
});

export default theme;
