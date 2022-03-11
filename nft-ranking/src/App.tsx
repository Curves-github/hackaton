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
import Login from "./components/login";
import Profile from "./components/profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<AuthProtect />}>
          <Route element={<MainLayout />}>
            <Route index element={<Pools />} />
            <Route path="pool/:pool" element={<Pool />} />
            <Route path="pool/:pool/vote-process" element={<VoteProcess />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>  
  );
}

export default App;
