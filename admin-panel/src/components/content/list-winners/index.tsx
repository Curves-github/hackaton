import { Card, CardHeader, List, ListItemButton, Avatar, ListItemText } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useMainStore } from "../../../store";
import { stringToInt } from "../../../utils/string-avatar";
import ListNftStore from "./store";

const ListWinners = observer(() => {
  
  const { contract } = useMainStore()
  const [ store ] = useState(() => new ListNftStore(contract))
  useEffect(() => {
    store.init()
  }, [])


  return (
    <Card sx={{ overflow: "auto", minWidth: "30vw" }}>
      <CardHeader title="WinnersList"></CardHeader>
      <List>
        { store.winners.map(item => (
          <ListItemButton key={item.accountId}>
            <Avatar alt="" src={"/avatars/" + (stringToInt(item.accountId, 8)+1) + ".jpg"} sx={{ mr: 1 }} />
            <ListItemText 
              primary={item.accountId} 
              secondary={`${item.normalizeContribution} (${item.contribution} / ${item.clicks} clicks)`} 
            />
          </ListItemButton>
        ))}
      </List>
    </Card>
  )
})

export default ListWinners