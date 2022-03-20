import { forwardRef } from "react";
import { Box, Dialog, DialogContent, DialogTitle, Grow, Slide, Typography, Zoom } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import { observer } from "mobx-react-lite"
import { FunctionComponent } from "react"
import { useMainStore } from "../../store"

const Transition = forwardRef((props: any, ref) => {
  return <Grow ref={ref} {...props} />;
});

const ChampionsTable: FunctionComponent = observer(() => {

  const mainStore = useMainStore()

  return (
    <Dialog 
      open={mainStore.champions.dialogOpened} 
      TransitionComponent={Transition} 
      onClose={() => mainStore.champions.setDialogOpened(false)}
    >
      <DialogTitle>Наши фавориты</DialogTitle>
      <DialogContent sx={{ overflowX: "hidden" }}>
        {mainStore.champions.data && mainStore.champions.data.map(card => (
          <Box width={500} mb={1} display="flex" alignItems="center" key={card.id}>
            <Typography fontWeight={600} sx={{ width: 120 }}>{card.id}</Typography>
            <Typography fontSize={14}>{Math.floor(card.rate)}</Typography>
            <img src={"./images/"+card.imgSrc} height={50} style={{ marginLeft: "auto" }}/>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  )
})

export default ChampionsTable