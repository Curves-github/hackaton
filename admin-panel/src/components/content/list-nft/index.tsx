import { Avatar, Card, CardHeader, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useMainStore } from "../../../store";
import ListNftStore from "./store";

const ListNft = observer(() => {

  const { contract } = useMainStore()
  const [ store ] = useState(() => new ListNftStore(contract))
  useEffect(() => {
    store.init()
  }, [])

  return (
    <Card sx={{ overflow: "auto", minWidth: "30vw" }}>
      <CardHeader title="NFT list"></CardHeader>
      <List>
        { store.cards.map(item => (
          <ListItemButton component="a" key={item.id} href={item.url} target="blank">
            <Avatar src={"/images/"+item.imgSrc} sx={{ mr: 1 }}/>
            <ListItemText 
              primary={item.url} 
              secondary={`Rate: ${item.rate.toFixed(2)}. Views: ${item.participations}`} />
          </ListItemButton>
        ))}
      </List>
    </Card>
  )

})

export default ListNft