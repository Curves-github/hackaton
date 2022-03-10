import { observer } from 'mobx-react-lite'
import {FunctionComponent} from 'react'
import { Outlet } from 'react-router-dom'
import { useMainStore } from '../../store'

const MainLayout:FunctionComponent = observer(() => {
  const mainStore = useMainStore()
  return (
    <>
    <div>MainLayout</div>
    <Outlet />
    <button onClick={()=>mainStore.contract.signOut()}>logout</button>
    </>
  )
})

export default MainLayout