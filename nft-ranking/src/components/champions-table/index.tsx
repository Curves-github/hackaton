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
      open={mainStore.ui.dialogOpened} 
      TransitionComponent={Transition} 
 
      onClose={() => mainStore.ui.setDialogOpened(false)}
    >
      <DialogTitle>Наши фавориты</DialogTitle>
      <DialogContent>
        {mainStore.cards.sortedCards.map(item => (
          <Box width={500} mb={1} display="flex" alignItems="center" key={item.id}>
            <Typography fontWeight={600} sx={{ width: 120 }}>{item.id}</Typography>
            <Typography fontSize={14}>{Math.floor(item.rate)}</Typography>
            <img src={item.src} height={50} style={{ marginLeft: "auto" }}/>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  )
})

export default ChampionsTable