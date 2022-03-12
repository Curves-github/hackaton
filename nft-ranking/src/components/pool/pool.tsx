import { Avatar, Box, Typography, Link, Button, IconButton } from '@mui/material';
import { FC, useMemo } from 'react'
import { Outlet, useOutletContext, useNavigate } from 'react-router-dom'
import ContentWrapper from '../content-wrapper';
import {Pool as PoolType} from '../../data/pools';
import Nav from './nav';
import { ArrowBackIosNewOutlined } from '@mui/icons-material';

type ContextType = {pool: PoolType | null};

export const getPoolStatus = (pool: PoolType):'new' | 'continue' | 'ended' | 'filled' => {
  if(new Date(pool.endDateTime) < new Date()){
    return 'ended'
  } else {
    return 'new'
  }
}

const PoolPure:FC<{pool: PoolType}> = ({pool}) => {
  const navigate = useNavigate();

  const poolStatus = useMemo(()=>getPoolStatus(pool),[pool]);

  const onJoinGame = ()=>{
    navigate('vote-process')
  }
  

  return (
    <>
      <Box sx={{height:"230px", position:'relative'}}>
        <ContentWrapper sx={{position:'absolute',top:'30px', height: 0}}>
          <IconButton onClick={()=>navigate('/')} aria-label="back" sx={{'&:hover': {
            background: "rgba(0,0,0,0.2)"
          }}}>
            <ArrowBackIosNewOutlined />
          </IconButton>
        </ContentWrapper>
        <img src={pool.preview} alt="" style={{width:'100%', height:'100%', objectFit:"cover"}} />
        <Box sx={{
            position:"absolute", 
            bottom:0,
            left:0, 
            width:'100%',
            p:'10px 0',
            background: 'linear-gradient(180deg, rgba(244, 244, 244, 0.08) 0%, rgba(255, 255, 255, 0.22) 100%)',
            backdropFilter: 'blur(15px)'
        }}>
          <ContentWrapper sx={{display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center',gap:'10px'}}>
            <Avatar sx={{width:36, height:36}} src={pool.logo}/>
            <Typography>{pool.owner}</Typography>
            <Link href={pool.link} target="_blank">{pool.link.replace(/(^https:\/\/|\/$)/g,'')}</Link>
          </ContentWrapper>
        </Box>
      </Box>
      <ContentWrapper sx={{pt:"32px", mb:"30px"}}>
        <Nav />
      </ContentWrapper>
      <Outlet context={{pool}} />
      {['new', 'continue'].includes(poolStatus) && (
        <ContentWrapper sx={{position:'absolute',bottom: '50px', display: 'grid', gridTemplateColumns:'1fr', width:'100%'}}>
          <Button onClick={onJoinGame} color="primary" variant="contained" fullWidth size="large">
            Start game
          </Button>
        </ContentWrapper>
      )
      }
    </>
  )
}

export default PoolPure

export function usePool() {
  return useOutletContext<ContextType>();
}