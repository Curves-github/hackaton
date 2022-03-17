
import { createTheme, experimental_sx as sx } from "@mui/material/styles";
import InnerRegular from '../assets/fonts/Inter-Regular.woff2';
import InnerBold from '../assets/fonts/Inter-Bold.woff2';

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#99F876",
      contrastText: "#000"
    },
    secondary: {
      main: "#464A4D"
    },
    background: {
      default: "#191A1D",
      paper: "#1A1B20"
    },
    info: {
      main: "#1F2224"
    }
  },
  typography: (palette) => ({
    fontSize: 13,
    fontFamily: [ 'Inter', 'sans-serif' ].join(", "),
    button: {
      textTransform: "none",
      fontWeight: 600
    },
    h3: {
      fontSize: 32
    },
    allVariants: {
      color: palette.text.primary
    },
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
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Inner';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Inner'), local('Inner-Regular'), url(${InnerRegular}) format('woff2');
        };
        @font-face {
          font-family: 'Inner';
          font-style: normal;
          font-display: swap;
          font-weight: 700;
          src: local('Inner'), local('Inner-Bold'), url(${InnerBold}) format('woff2');
        };
      `,
    },
    MuiTypography:{
      variants:[
        {
          props: {variant: 'h1'},
          style: {
            fontWeight: 'bold'
          }
        },
        {
          props: {variant: 'h2'},
          style: {
            fontWeight: 'bold'
          }
        },
        {
          props: {variant: 'h3'},
          style: {
            fontWeight: 'bold'
          }
        },
        {
          props: {variant: 'h4'},
          style: {
            fontWeight: 'bold'
          }
        },
        {
          props: {variant: 'h5'},
          style: {
            fontWeight: 'bold'
          }
        },
        {
          props: {variant: 'h6'},
          style: {
            fontWeight: 'bold'
          }
        }
      ]
    },
    MuiButton: {
      variants:[
        {
          props: {variant: 'contained', size:'large'},
          style:{
            borderRadius: '48px',
            height:"48px"
          }
        }
      ]
    }
  }
});

export default defaultTheme