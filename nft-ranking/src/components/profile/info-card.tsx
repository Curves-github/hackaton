import { Box, Typography } from "@mui/material"
import { FC } from "react"

type InfoCardTypes = {
  title: string,
  value: string
}

const InfoCard: FC<InfoCardTypes> = ({ title, value }) => {

  return (
    <Box width={90} height={80} border="1px solid #43474A" display="flex" justifyContent="center" flexDirection="column" borderRadius={1}>
      <Typography>{ title }</Typography>
      <Typography color="primary" fontSize={20} fontWeight={500}>{ value }</Typography>
    </Box>
  )

}

export default InfoCard