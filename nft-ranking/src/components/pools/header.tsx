import { Avatar, Box, Typography } from '@mui/material'
import {FC} from 'react'
import avatar from '../../assets/avatar.png'
import {ReactComponent as NotificationIcon} from '../../assets/notification.svg';


const Header:FC = ()=>{
  return (
    <Box sx={{display: 'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:'10px', pb:"7px", borderBottom:"1px solid #292C2E"}}>
      <Avatar alt="" src={avatar} sx={{ width: 32, height: 32 }} />
      <Box>
        <Typography paragraph sx={{mb:0,fontWeight:'bold',fontSize:'12px'}} variant="subtitle2">Mary Lee</Typography>
        <Typography color="primary" sx={{fontSize:'14px'}}>Earned: 5&nbsp;Ⓝ</Typography>
      </Box>
      <Box>
        <NotificationIcon style={{width:'26px', height: '26px'}} />
      </Box>
    </Box>
  )
} 

export default Header;