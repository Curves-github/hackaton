import { Box, Button, Card, CardMedia, ListItemButton, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { FunctionComponent, useEffect } from "react"
import { useMainStore } from "../../store"

const Viewport: FunctionComponent = observer(() => {

  const mainStore = useMainStore()

  if (mainStore.cards.showed === null) {
    return <Card elevation={0} sx={{ flexGrow: 1 }}></Card>
  }

  return (
    <Card elevation={0} sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Выберите лучший вариант</Typography>
     
      <Stack direction="row" spacing={3}>
        { mainStore.cards.showed.map((card, index) => (
          <ListItemButton 
            key={index} 
            sx={{ display: "flex", flexDirection: "column", borderRadius: 1, p: 3 }}
            onClick={() => mainStore.cards.rateCard(index)}
          >
            <img src={card.src} height={250}/>
            <Typography align="center" fontWeight={600} sx={{ mt: 2 }}>{ card.id }</Typography>
          </ListItemButton>
        ))}
      </Stack>
      <Button 
        variant="outlined" 
        sx={{ mt: 3, px: 5, lineHeight: 3 }}
        onClick={() => mainStore.cards.rateCard(0, true)}
      >
        Я не знаю
      </Button>
    </Card>
  )

})

export default Viewport