import { Box, Button, Card, IconButton, ListItemButton, Stack, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import { FunctionComponent, useEffect, useState } from "react"
import { useMainStore } from "../../store"
import { Virtual } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import cn from "classnames"
import 'swiper/css';

import swipeIconSrc from './swipe-icon.png'

import ArrowBackIosNewOutlined from '@mui/icons-material/ArrowBackIosNewOutlined'
import ContentWrapper from "../content-wrapper"

const VoteProcess: FunctionComponent = observer(() => {

  const [ freeze, setFreeze ] = useState(true)
  const mainStore = useMainStore()
  const navigate = useNavigate();

  useEffect(() => {
    mainStore.cards.init()
  }, [])

  const vote = (decision: -1 | 0 | 1) => {
    mainStore.cards.vote( decision )
    setFreeze(true)
  }

  return (
    <Card elevation={0} sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <ContentWrapper alignSelf="stretch" sx={{ py: 2, display: "flex", flexDirection: "row", alignItems: "center" }}>
        <IconButton onClick={()=>navigate('./../')} aria-label="back">
          <ArrowBackIosNewOutlined />
        </IconButton>
        <Typography flexGrow={1} textAlign="center">
          Clicks left: <Typography component="span" color="primary.main">{mainStore.cards.clicksLeft}</Typography>
        </Typography>
        <Box width={38}></Box>
      </ContentWrapper>
      <Box sx={{ py: 2, transition: "opacity 0.3s", opacity: freeze? 1: 0 }}>
        <img src={swipeIconSrc} alt="Swipe to move"/>
      </Box>
      { mainStore.cards.showed !== null && ( <>
        <Swiper 
          modules={[Virtual]} 
          spaceBetween={10} 
          centeredSlides={true}
          slidesPerView={1}
          onTouchStart={(swiper) => {
            if (freeze) {
              swiper.setProgress(0.5)
              setFreeze(false)
            }
          }}
          onChange={() => console.log("change")}
          className={cn("swiper-cards", freeze && "freeze")}
        >
          { mainStore.cards.showed.map((card, index) => (
            <SwiperSlide key={index} style={{ alignSelf: "center" }}>
              <ListItemButton 
                sx={{ display: "flex", flexDirection: "column", borderRadius: 1, p: 1 }}
                onClick={(() => vote( index === 0? 1: -1 ))}
              >
                <img 
                  src={"/images/"+card.imgSrc} 
                  
                  style={{ borderRadius: 10, maxHeight: 250, maxWidth: 250, objectFit: "cover" }}
                />
              </ListItemButton>
            </SwiperSlide>
          ))}
        </Swiper>
        <Button  
          sx={{ mt: 5, px: 5, lineHeight: 3 }}
          onClick={() => vote(0)}
        >
          Skip step
        </Button>
      </> )}
    </Card>
  )

})

export default VoteProcess