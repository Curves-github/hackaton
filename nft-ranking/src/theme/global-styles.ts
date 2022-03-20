import { Theme } from "@mui/material"

const styles = (theme: Theme) => ({
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: theme.palette.background.default
  },

  ".swiper-cards": {
    width: "250px", 
    overflow: "visible",
    "&.freeze .swiper-wrapper": {
      transform: `translate3d(-125px, 0px, 0px) !important`
    }
  }
})
export default styles