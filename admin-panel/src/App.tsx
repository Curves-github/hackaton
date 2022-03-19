import { Box, Button, Stack, Typography } from "@mui/material";
import { observer } from 'mobx-react-lite'
import Header from "./components/header";
import { useMainStore } from "./store";

const App = observer(() => {

  const { contract } = useMainStore()

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Header/>
      <Stack sx={{ flexGrow: "1", justifyContent: "center" }}>
        <Typography variant="h3" textAlign="center">Sign In to continue</Typography>

      </Stack>
    </Box>
  );

})

export default App