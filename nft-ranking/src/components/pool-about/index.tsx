import { Typography } from '@mui/material'
import {FC} from 'react'
import { format } from 'date-fns'
import ContentWrapper from '../content-wrapper';

import { usePool } from '../pool/pool';

const PoolAbout:FC = () => {
  const {pool} = usePool();
  if(!pool){
    return <></>
  }
  
  
  return (
    <ContentWrapper >
      <Typography align="center" variant="h4" sx={{mb:'2h'}}>{pool.name}</Typography>
      <Typography align="center" variant="subtitle1" sx={{mb:'30px'}}>Earn max prize: {pool.prize}&nbsp;Ⓝ</Typography>
      <Typography align="center" variant="subtitle1" sx={{fontWeight:'bold'}}>{format(new Date(pool.endDateTime), 'dd.MM, HH:mm')}</Typography>
      <Typography align="center" variant="subtitle1" sx={{mb:"30px"}}>Available until</Typography>
      <Typography align="center" sx={{fontSize:"18px"}}>{pool.description}</Typography>
    </ContentWrapper>
  )
}

export default PoolAbout