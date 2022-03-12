import {  ButtonGroup, Button, ButtonProps, Theme } from '@mui/material';
import { FC } from 'react'
import {  useMatch, useResolvedPath, useNavigate } from 'react-router-dom'

type ButtonLinkType = {href: string, activeColor:ButtonProps['color']} & ButtonProps;
const ButtonLink:FC<ButtonLinkType> = ({href, activeColor, color, onClick, ...rest})=>{
  const resolved = useResolvedPath(href);
  const match = useMatch({ path: resolved.pathname, end: true });
  const navigate = useNavigate(); 

  const onButtonClick:ButtonProps['onClick'] = (...args)=>{
    onClick?.(...args);
    navigate(resolved.pathname)
  }

  return <Button {...rest} color={match ? activeColor : color} onClick={onButtonClick}  />
}

const Nav:FC = () => {
  return (
    <ButtonGroup variant="contained" fullWidth sx={{
      p:'2px', 
      backgroundColor: (theme:Theme)=>theme.palette.secondary.main, 
      borderRadius: '8px',
      gap:'2px',
      '& .MuiButtonGroup-grouped':{
        borderRadius: '6px !important',
        border: 'none !important'
      }
     }}>
      <ButtonLink href="." color="secondary" activeColor="primary">About pool</ButtonLink>
      <ButtonLink href="winners" color="secondary" activeColor="primary">Winners</ButtonLink>
    </ButtonGroup>
  )
}


export default Nav