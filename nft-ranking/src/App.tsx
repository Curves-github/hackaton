import { Box } from '@mui/material';
import ChampionsTable from './components/champions-table';
import Header from './components/header';

import Viewport from './components/viewport';

function App() {
  return (
    <Box height="100vh" display="flex" px={3} py={3} boxSizing="border-box" >
      <Box flexGrow={1} display="flex" flexDirection="column">
        <Header/>
        <Viewport/>
      </Box>
      <ChampionsTable/>
    </Box>
  );
}

export default App;
