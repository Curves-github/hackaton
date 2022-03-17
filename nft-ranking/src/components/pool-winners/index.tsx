import { Typography } from '@mui/material'
import {FC} from 'react'
import ContentWrapper from '../content-wrapper'

const PoolWinners:FC = () => {
  return (
    <ContentWrapper sx={{ mt: "10vh", textAlign: "center" }}>
      <Typography variant="h4">Oops!</Typography>
      <Typography color="#B4B6B8" mt={1}>
        This game is not over yet. You will see the results when the timer runs out.
      </Typography>
    </ContentWrapper>
  )
}

export default PoolWinners