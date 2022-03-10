import { observer } from "mobx-react-lite";
import { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";
import { useMainStore } from "../../store";

const SLIDES = [
  {
    id:0,
  }
]


const Onboarding:FunctionComponent = observer(() => {
  const mainStore = useMainStore()
  
  if(mainStore.ui.onboardingCompleted){
    return <Navigate to="/" />
  }

  return (
    <>
      <div>Onboarding</div>
      <button onClick={()=>mainStore.ui.completeOnboarding()}>complete</button>
    </>
  )
})

export default Onboarding