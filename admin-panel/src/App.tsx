import { Box, Button, Stack, Typography } from "@mui/material";
import { observer } from 'mobx-react-lite'
import Content from "./components/content";
import Header from "./components/header";
import SignInScreen from "./components/sign-in";
import { useMainStore } from "./store";

const App = observer(() => {

  const { contract } = useMainStore()

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Header/>
      { contract.currentUser? (
        <Content/>
      ): (
        <SignInScreen/>
      )}
    </Box>
  );

})

export default App