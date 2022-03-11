import { Box, Chip } from '@mui/material'
import { FC } from 'react'
import {Filter} from './data';

type ComponentProps = {
  onClick: (id: number)=>void,
  active: number,
  filters: Filter[]
}

const PoolsFilters:FC<ComponentProps> = ({filters, active, onClick}) => {
  return (
    <Box sx={{display: 'flex', gap:'8px'}}>
      {filters.map(f=><Chip
        key={f.id}
        label={f.label}
        onClick={()=>onClick(f.id)}
        color={f.id === active ? 'primary' : 'default'}
      />)}
    </Box>
  )
}

export default PoolsFilters