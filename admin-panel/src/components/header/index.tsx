import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useMainStore } from '../../store'

import Logout from "@mui/icons-material/Logout"
import Login from "@mui/icons-material/Login"

const Header = observer(() => {

  const { contract } = useMainStore()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin-Panel
        </Typography>

        { contract.currentUser? (
          <>
            <Typography mr={2}>{ contract.currentUser.accountId }</Typography>
            <IconButton color="primary" onClick={() => contract.signOut()}>
              <Logout/>
            </IconButton>
          </>
        ): ( 
          <Button color="primary" sx={{ fontSize: 16, px: 2.5 }} onClick={() => contract.signIn()}>
            Sign In
            <Login sx={{ ml: 1.5 }} />
          </Button> 
        )}
      </Toolbar>
    </AppBar>
  )
})

export default Header