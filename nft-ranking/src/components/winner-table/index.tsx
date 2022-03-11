import { forwardRef } from "react";
import { Box, Dialog, DialogContent, DialogTitle, Grow, Slide, Typography, Zoom } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import { observer } from "mobx-react-lite"
import { FunctionComponent } from "react"
import { useMainStore } from "../../store"

const Transition = forwardRef((props: any, ref) => {
  return <Grow ref={ref} {...props} />;
});

const WinnersTable: FunctionComponent = observer(() => {

  const mainStore = useMainStore()

  return (
    <Dialog 
      open={mainStore.winners.dialogOpened} 
      TransitionComponent={Transition} 
      onClose={() => mainStore.winners.setDialogOpened(false)}
    >
      <DialogTitle>Вклад победителей:</DialogTitle>
      <DialogContent sx={{ overflowX: "hidden" }}>
        {mainStore.winners.data && mainStore.winners.data.map(winner => (
          <Box width={500} mb={1} display="flex" alignItems="center" key={winner.accountId} justifyContent="space-between">
            <Typography fontWeight={600} >{winner.accountId}</Typography>
            <Typography fontSize={14} >{Math.floor(winner.contribution)}</Typography>
            <Typography fontSize={14}>{Math.floor(winner.normalizeContribution * 100) / 100}</Typography>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  )
})

export default WinnersTable