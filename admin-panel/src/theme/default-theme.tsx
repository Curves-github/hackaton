import { createTheme } from "@mui/material";

const ScrollbarStyle = {
  "::-webkit-scrollbar": {
    width: 5
  },
  "::-webkit-scrollbar-track": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 8
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3
  },
}

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#99F876",
      contrastText: "white"
    },
    secondary: {
      main: "#464A4D"
    },
    background: {
      default: "#191A1D",
      paper: "#1A1B20"
    }
  },
  typography: (palette) => ({
    fontSize: 13,
    fontFamily: [ 'Inter', 'sans-serif' ].join(", "),
    button: {
      textTransform: "none"
    },
    allVariants: {
      color: palette.text.primary
    },
    h1: {
      fontWeight: 700
    },
    h2: {
      fontWeight: 700
    },
    h3: {
      fontWeight: 700
    }
  }),
  shape: {
    borderRadius: 12
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          ...ScrollbarStyle
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          ...ScrollbarStyle
        }
      }
    },
  }
})

export default defaultTheme