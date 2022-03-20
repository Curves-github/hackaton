import { Avatar, Box, ButtonProps, CardActionArea, Typography } from '@mui/material'
import {FC} from 'react'
import { useNavigate } from 'react-router-dom';
import { useMainStore } from 'src/store';
import avatar from '../../assets/avatar.png'
import {ReactComponent as NotificationIcon} from '../../assets/notification.svg';
import ContentWrapper from '../content-wrapper';
import UserProfile from '../user-profile';

type HeaderProps = {
  navigateTo?: string
} & ButtonProps

const Header:FC<HeaderProps> = ({ navigateTo, sx, ...otherProps })=>{

  const navigate = useNavigate()
  const { contract } = useMainStore()

  return (
    <CardActionArea onClick={() => navigate(navigateTo || "/profile")} sx={{ px: 3, ...sx }}>
      <ContentWrapper sx={{ "&.MuiBox-root": { px: 0 }, pt: 2, display: 'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:'10px', pb: 1, borderBottom:"1px solid #292C2E"}}>
        <UserProfile username={contract.currentUser?.accountId} subtitle="Earned: 5Ⓝ"/>
        <Box>
          <NotificationIcon style={{width:'26px', height: '26px'}} />
        </Box>
      </ContentWrapper>
    </CardActionArea>
  )
} 

export default Header;