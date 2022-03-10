import {FunctionComponent} from 'react'
import { Outlet } from 'react-router-dom'

const HorizontalOnlyProtect:FunctionComponent = () => {
  return <Outlet />
}

export default HorizontalOnlyProtect