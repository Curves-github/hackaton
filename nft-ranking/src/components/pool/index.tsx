import { Avatar, Box, Typography, Link, ButtonGroup, Button } from '@mui/material';
import { FC, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ContentWrapper from '../content-wrapper';
import {POOLS} from '../../data/pools';
import Switcher from './switcher';

const Pool:FC = () => {
  const {pool:poolId} = useParams();

  const pool = useMemo(()=>POOLS.find(p=>p.id === Number(poolId)), [poolId]);
  if(!pool){
    return <Typography align="center">Pool not found</Typography>
  }
  return (
    <>
      <Box sx={{height:"230px", position:'relative'}}>
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
      <Box sx={{pt:'32px'}}>
      <ContentWrapper>
        <ButtonGroup variant="contained" fullWidth>
          <Button color="primary">About pool</Button>
          <Button color="secondary">Winners</Button>
        </ButtonGroup>
      </ContentWrapper>

      </Box>
    </>
  )
}

export default Pool