import { FC } from 'react'
import PoolItem from './poolItem';
import {Pool} from '../../data/pools';
import { Box } from '@mui/material';

type ComponentProps = {
  pools: Pool[]
}



const PoolsList:FC<ComponentProps> = ({pools}) => {
  return (
    <Box sx={{display: 'flex', flexDirection:"column", gap:"20px"}}>
      {pools.map((p,i)=><PoolItem key={p.id} pool={p} withBg={i % 2 === 0} />)}
    </Box>
  )
}

export default PoolsList