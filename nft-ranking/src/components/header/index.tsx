import { Box, Button, Typography, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { FunctionComponent } from "react"
import { useMainStore } from "../../store"

const Header: FunctionComponent = observer(() => {

  const mainStore = useMainStore()

  return (
    <Box component="header" height={50} mb={2} display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="h5" fontWeight={700}>NFTinder</Typography>
      <Stack direction="row" spacing={2} alignItems="center" ml="auto">
        { mainStore.contract.currentUser
          ? <>
              <Typography>
                Account ID: {mainStore.contract.currentUser.accountId}
              </Typography>
              <Button variant="contained" onClick={() => mainStore.contract.signOut()}>Log out</Button>
              <Button variant="contained" sx={{ px: 4, lineHeight: 3 }} onClick={() => mainStore.ui.setDialogOpened(true)}>
                Champions Board
              </Button>
            </>
          : 
          <>
            <Typography>Sign In To Use The App: </Typography>
            <Button variant="contained" onClick={() => mainStore.contract.signIn()}>Log in</Button>
          </>
        }
      </Stack>
    </Box>
  )
})

export default Header