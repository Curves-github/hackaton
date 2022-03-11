import { observer } from 'mobx-react-lite';
import {FunctionComponent} from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useMainStore } from '../../store';

const Login:FunctionComponent = observer(() => {
  const mainStore = useMainStore()
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  if(!!mainStore.contract.currentUser){
    return <Navigate to={from} replace />
  }

  return (
    <div><button onClick={()=>mainStore.contract.signIn()}>Login with near</button></div>
  )
})

export default Login