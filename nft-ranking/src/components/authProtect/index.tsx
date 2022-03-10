import { observer } from 'mobx-react-lite';
import {FunctionComponent} from 'react'
import {Outlet, Navigate, useLocation} from 'react-router-dom';
import { useMainStore } from '../../store';

const AuthProtect:FunctionComponent = observer(() => {
  const mainStore = useMainStore()
  const location = useLocation();
  
  if(!mainStore.contract.isInit){
    return <p>loading...</p>
  }

  if(!mainStore.ui.onboardingCompleted){
    return <Navigate to="/onboarding" replace state={{from:location}} />
  }

  if(!mainStore.contract.currentUser){
    return <Navigate to="/login" replace state={{from:location}} />
  }

  return <Outlet />
})

export default AuthProtect