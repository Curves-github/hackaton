import { Box, Button, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { FunctionComponent } from "react"
import { useMainStore } from "../../store"

const Header: FunctionComponent = observer(() => {

  const mainStore = useMainStore()

  return (
    <Box component="header" height={50} mb={2} display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="h5" fontWeight={700}>Соревнование NFT</Typography>
      <Button variant="contained" sx={{ px: 4, lineHeight: 3 }} onClick={() => mainStore.ui.setDialogOpened(true)}>
        Таблица чемпионов
      </Button>
    </Box>
  )
})

export default Header