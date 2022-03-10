import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Onboarding from './components/onboarding';
import AuthProtect from './components/authProtect';
import Pools from './components/pools';
import Pool from './components/pool';
import VoteProcess from './components/vote-process';
import MainLayout from "./components/mainLayout";
import HorizontalOnlyProtect from "./components/horizontal-only-protect";
import Login from "./components/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<AuthProtect />}>
          <Route element={<MainLayout />}>
            <Route index element={<Pools />} />
            <Route path="/pool/:pool" element={<Pool />} />
            <Route path="/pool/:pool/vote-process" element={<HorizontalOnlyProtect />}>
              <Route element={<VoteProcess />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>  
    // <Box height="100vh" display="flex" px={3} py={3} boxSizing="border-box" >
    //   <Box flexGrow={1} display="flex" flexDirection="column">
    //     <Header/>
    //     <Viewport/>
    //   </Box>
    //   <ChampionsTable/>
    // </Box>
  );
}

export default App;
