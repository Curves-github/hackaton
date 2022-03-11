import { Box, Button, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";
import { useMainStore } from "../../store";
import onboarding1 from '../../assets/onboarding/1.png';
import styles from './styles.module.scss';
import { BoxProps } from "@mui/system";

const SLIDES = [
  {
    id:0,
  }
]

const ContentWrapper:FunctionComponent<BoxProps> = ({sx,...rest})=>{
  return <Box {...rest} sx={{...sx, paddingLeft:'25px', paddingRight:'25px'}}  />
};

const Onboarding:FunctionComponent = observer(() => {
  const mainStore = useMainStore()
  
  if(mainStore.ui.onboardingCompleted){
    return <Navigate to="/" />
  }
  
  const onComplete = ()=>{
    mainStore.contract.signIn();
  }

  return (
    <>
      <Box sx={{paddingTop: `70px`, height:'100vh', display:"grid", gridTemplateRows:'auto 1fr'}}>
        <div className={styles.pagination}>
          <span className={styles.pagination__item}></span>
          <span className={styles.pagination__item}></span>
          <span className={styles.pagination__item}></span>
        </div>
        <Box sx={{marginTop:'30px', overflow:'hidden', display:'grid', gridTemplateRows:"auto 1fr"}}>
          <ContentWrapper>
            <Typography variant="h3" align="center">Participate in mini-games and earn.</Typography>
          </ContentWrapper>
          <Box sx={{display: 'flex', justifyContent: 'center', overflow:'hidden'}}>
            <img src={onboarding1} alt="" style={{width:'100%', height:'auto', objectFit:"cover",objectPosition:'top'}} />
          </Box>
        </Box>
      </Box>
      <ContentWrapper sx={{position:'absolute',bottom: '50px', display: 'grid', gridTemplateColumns:'1fr', width:'100%'}}>
          <Button onClick={onComplete} color="primary" variant="contained" fullWidth>Login by Near</Button>
      </ContentWrapper>
    </>
  )
})

export default Onboarding