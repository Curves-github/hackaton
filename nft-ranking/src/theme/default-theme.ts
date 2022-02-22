
import { createTheme, experimental_sx as sx } from "@mui/material/styles";

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10B664",
      contrastText: "white"
    },
    secondary: {
      main: "#303440"
    },
    background: {
      default: "#21242B",
      paper: "#1A1B20"
    }
  },
  typography: (palette) => ({
    fontSize: 13,
    fontFamily: [ 'Montserrat', 'sans-serif' ].join(", "),
    button: {
      textTransform: "none",
      fontWeight: 600
    },
    allVariants: {
      color: palette.text.primary
    }
  }),
  shape: {
    borderRadius: 12
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: sx({
          bgcolor: "background.paper",
          borderRadius: 1,
          border: 1,
          borderColor: "#27282D",
        }),
        indicator: sx({
          height: "100%",
          borderRadius: 0.8
        })
      }
    },
    MuiTab: {
      styleOverrides: {
        root: sx({
          minHeight: 52,
          borderRadius: 0.8,
          transition: "color 0.2s",
          fontWeight: 600,
          fontSize: 14,
          "&.Mui-selected": {
            color: "primary.contrastText",
            zIndex: 1
          }
        })
      }
    }
  }
});

export default defaultTheme