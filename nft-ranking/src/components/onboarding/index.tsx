import { Box, Button, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FunctionComponent, useMemo,useState, useEffect, Fragment, useRef, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useMainStore } from "../../store";
import {SLIDES} from './data';
import {ReactComponent as LogoIcon} from '../../assets/logo.svg';
import ContentWrapper from "src/components/content-wrapper";
import Pagination from "src/components/onboarding/pagination";


const SWITCH_TIME = 5000;

const Onboarding:FunctionComponent = observer(() => {
  const mainStore = useMainStore()
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>();

  const activeSlide = useMemo(()=>SLIDES[activeIndex], [activeIndex]);

  const nextSlide = useCallback(()=>setActiveIndex(i=>Math.min(i+1, SLIDES.length - 1)), []);
  const prevSlide = useCallback(()=>setActiveIndex(i=>Math.max(i-1, 0)), []);

  useEffect(()=>{
    const timer = setTimeout(nextSlide, SWITCH_TIME)
    return ()=>clearTimeout(timer);
  },[activeIndex, nextSlide])

  // if(mainStore.ui.onboardingCompleted){
  //   return <Navigate to="/" />
  // }
  
  const onComplete = ()=>{
    mainStore.contract.signIn();
  }

  const onContentClick = (e:any)=>{
    if(!contentRef?.current) return;
    let bounds = contentRef.current.getBoundingClientRect();
    let x = e.clientX - bounds.left;
   
    const w = contentRef.current.offsetWidth;

    if(x > w * 0.7){
      nextSlide()
    } else if(x < w * 0.3) {
      prevSlide();
    }
  }

  const ImageWrapper = activeSlide.wrappedImage ? ContentWrapper : Fragment;

  return (
    <>
      <Box sx={{ pt: 3, height:'100vh', display:"grid", overflow: "hidden", gridTemplateRows:'auto 1fr'}}>
        <Pagination count={SLIDES.length} onClick={(i)=>setActiveIndex(i)} activeIndex={activeIndex} switchTime={SWITCH_TIME} />
        <Box sx={{mt:'20px', overflow:'hidden', display:'grid', gridTemplateRows:"auto 1fr"}} onClick={onContentClick} ref={contentRef}>
          <ContentWrapper>
            {activeIndex === 0 && (
              <Box sx={{display: 'flex', justifyContent: 'center', mb:'10px'}}>
                <LogoIcon style={{width:'86px', height:"31px"}} />
              </Box>
            )}
            <Typography variant="h3" align="center">{activeSlide.text}</Typography>
          </ContentWrapper>
          <ImageWrapper>
            <Box sx={{display: 'flex', justifyContent: 'center', overflow:'hidden', mt:"30px"}}>
              <img src={activeSlide.image} alt="" style={{width:'100%', height:'auto', objectFit:"cover",objectPosition:'top'}} />
            </Box>
          </ImageWrapper>
        </Box>
      </Box>
      <ContentWrapper sx={{position:'absolute',bottom: '50px', display: 'grid', gridTemplateColumns:'1fr', width:'100%'}}>
        <Button onClick={onComplete} color="primary" variant="contained" fullWidth size="large">
          Login
        </Button>
      </ContentWrapper>
    </>
  )
})

export default Onboarding