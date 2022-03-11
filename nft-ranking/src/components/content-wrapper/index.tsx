import { FC } from 'react'
import { BoxProps } from "@mui/system";
import { Box } from '@mui/material';

const ContentWrapper:FC<BoxProps> = ({sx,...rest})=>{
  return <Box {...rest} sx={{...sx, paddingLeft:'25px', paddingRight:'25px'}}  />
};

export default ContentWrapper