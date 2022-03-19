import { Box, Typography, Avatar } from "@mui/material";
import { FC } from "react";
import { stringToInt } from "src/utils/string-avatar";

const UserProfile: FC<{ username?: string, subtitle?: string }> = ({ username, subtitle }) => {

  const avatar = username && ("/avatars/" + (stringToInt(username, 8)+1) + ".jpg")
  console.log(avatar)

  return (
    <>
      <Avatar alt="" src={avatar} sx={{ width: 32, height: 32 }} />
      <Box>
        <Typography paragraph sx={{mb:0,fontWeight:'bold',fontSize:'12px'}} variant="subtitle2">
          { username }
        </Typography>
        <Typography color="primary" sx={{fontSize:'13px'}}>{ subtitle }</Typography>
      </Box>
    </>
  )
}

export default UserProfile