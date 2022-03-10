import { Box, Button, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";
import { useMainStore } from "../../store";
import onboarding1 from '../../assets/onboarding/1.png';

const SLIDES = [
  {
    id:0,
  }
]


const Onboarding:FunctionComponent = observer(() => {
  const mainStore = useMainStore()
  
  if(mainStore.ui.onboardingCompleted){
    return <Navigate to="/" />
  }

  return (
    <Box sx={{p:'70px 25px 50px', minHeight:'100vh'}}>
      <Typography variant="h3" align="center">Onboarding</Typography>
      <Box sx={{display: 'flex', justifyContent: 'center'}}><img src={onboarding1} alt="" /></Box>
      <Button onClick={()=>mainStore.ui.completeOnboarding()} color="primary" variant="contained" fullWidth>Okey, I got it</Button>
    </Box>
  )
})

export default Onboarding