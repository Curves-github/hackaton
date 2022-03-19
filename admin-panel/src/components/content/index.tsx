import { Stack } from "@mui/material";
import { observer } from "mobx-react-lite";
import ListNft from "./list-nft";
import ListWinners from "./list-winners";

const Content = observer(() => {

  return (
    <Stack direction="row" flexGrow={1} overflow="hidden" m={3} spacing="5vw" justifyContent="center">
      <ListNft/>
      <ListWinners/>
    </Stack>
  )
})

export default Content