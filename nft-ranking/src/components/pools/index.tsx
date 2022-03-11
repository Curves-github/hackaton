import {FC, useMemo, useState} from 'react'
import { Box } from '@mui/material'
import ContentWrapper from 'src/components/content-wrapper';
import PoolsFilters from 'src/components/pools/poolsFilters';
import PoolsList from 'src/components/pools/poolsList';
import Header from './header';
import {FILTERS, POOLS} from './data';


const Pools:FC = () => {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].id);
  const onFilterClick = (id:number)=>{
    setActiveFilter(id);
  }

  const pools = useMemo(()=>{
    switch(activeFilter){
      case 0:
      default:
        return POOLS;
      case 1:
        return POOLS.filter(p=>p.userParticipation)
    }
  }, [activeFilter])

  const sortedPools = useMemo(()=>pools.sort((a,b)=>new Date(b.endDateTime).getTime() - new Date(a.endDateTime).getTime()),[pools])

  
  return (
    <Box pt="30px" sx={{height: '100vh', overflow:'hidden', display: 'grid', gridTemplateRows:"auto auto 1fr"}}>
      <ContentWrapper>
        <Header />
      </ContentWrapper>
      <ContentWrapper mt="30px" sx={{display: 'grid', gridTemplateRows:"auto 1fr", gap:'20px'}}>
        <PoolsFilters active={activeFilter} onClick={onFilterClick} filters={FILTERS} />
      </ContentWrapper>
      <ContentWrapper sx={{overflow:'auto', pb: '30px'}}>
        <PoolsList pools={sortedPools} />
      </ContentWrapper>
    </Box>
  )
}

export default Pools