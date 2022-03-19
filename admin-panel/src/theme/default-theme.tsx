import { createTheme } from "@mui/material";

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
  }
})

export default defaultTheme