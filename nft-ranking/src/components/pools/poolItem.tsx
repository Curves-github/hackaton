import { Avatar, Box, Typography } from '@mui/material';
import { FC } from 'react'
import {Pool} from '../../data/pools';
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom';

const PoolItem:FC<{pool: Pool, withBg?: boolean}> = ({pool, withBg}) => {
  const navigate = useNavigate();
  return (
    <Box 
      onClick={()=>navigate(`pool/${pool.id}`)} 
      sx={{
        display: 'grid', 
        gridTemplateColumns:'auto 1fr auto', 
        alignItems:'center', 
        gap:'10px', 
        p:"10px", 
        background: withBg ? '#28292D' : "transparent", 
        borderRadius:'8px', 
        cursor: 'pointer'
      }}
    >
      <Avatar alt="" src={pool.logo} sx={{ width: 36, height: 36 }} />
      <Box>
        <Typography paragraph sx={{mb:0,fontSize:'14px'}}>{pool.name}</Typography>
        <Typography color="primary" sx={{fontSize:'14px', fontWeight:'bold'}}>{pool.prize}&nbsp;Ⓝ</Typography>
      </Box>
      <Box>
        <Typography>{format(new Date(pool.endDateTime), 'dd.MM, HH:mm')}</Typography>
      </Box>
    </Box>
  )
}

export default PoolItem