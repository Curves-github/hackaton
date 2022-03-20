import { observer } from 'mobx-react-lite'
import {FunctionComponent} from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout:FunctionComponent = observer(() => {
  return (
    
    <Outlet />
    
  )
})

export default MainLayout