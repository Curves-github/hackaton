import { Box, Button, Card, CircularProgress, Stack, Typography } from '@mui/material'
import {FC, useState} from 'react'
import Header from '../pools/header'

import BarChartRounded from '@mui/icons-material/BarChart'
import InfoCard from './info-card'
import { useTimeout } from 'src/utils/use-timeout'
import { useMainStore } from 'src/store'

const Profile: FC = () => {

  const { contract } = useMainStore()
  const [ show, setShow ] = useState(false)
  useTimeout(() => setShow(true), 10)

  return (
    <Stack height="100vh" spacing={2} px={3} pb={2}>
      <Header navigateTo="/" sx={{ px: 0 }}/>
      <Card sx={{ flexGrow: 1, justifyContent: "space-evenly", display: "flex", flexDirection: "column" }}>
        <Typography textAlign="center" fontSize={16}>
          <BarChartRounded color="primary" sx={{ verticalAlign: "bottom", mb: 0.1 }} />Statistics
        </Typography>
        <Stack direction="row" justifyContent="center" textAlign="center" spacing={2}>
          <InfoCard title="Games" value="65"/>
          <InfoCard title="Victories" value="11"/>
        </Stack>

        <Stack width={200} height={200} alignSelf="center" justifyContent="center" alignItems="center">
          <CircularProgress thickness={2} variant="determinate" size={200} value={100} color="info" sx={{ position: "absolute" }} />
          <CircularProgress thickness={2} variant="determinate" size={200} value={show? 21: 0} sx={{ position: "absolute" }} />
          <Typography color="primary" fontSize={26} fontWeight={500}>21%</Typography>
          <Typography>Win ratio</Typography>
        </Stack>

        <Stack direction="row" justifyContent="center" textAlign="center" spacing={2}>
          <InfoCard title="Earned" value="15Ⓝ"/>
          <InfoCard title="Help me" value="?"/>
        </Stack>
      </Card>
      <Button onClick={() => contract.signOut()} color="error" sx={{ py: 1.5, fontWeight: 400, mx: 2 }}>
        Log out
      </Button>
    </Stack>
  )
}

export default Profile