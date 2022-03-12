import { Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import { POOLS } from "../../data/pools";
import PoolPure from "./pool";


const Pool:FC = () => {
  const {pool:poolId} = useParams();
  const pool = useMemo(()=>POOLS.find(p=>p.id === Number(poolId)), [poolId]);

  if(!pool){
    return <Typography align="center">Pool not found</Typography>
  }

  return <PoolPure pool={pool} />
}

export default Pool
