import { action, IReactionDisposer, makeObservable, observable, reaction } from "mobx"
import MainStore from "../store"

class UiStore {
  private mainStore: MainStore
  dialogOpened = false
  loading = false
  data: any[] | null = null
  onboardingCompleted = false
  userStateReaction: IReactionDisposer;

  constructor(mainStore: MainStore) {
    this.mainStore = mainStore
    makeObservable(this, {
      dialogOpened: observable,
      loading: observable,
      data: observable,
      onboardingCompleted: observable,
      setDialogOpened: action,
      setData: action,
    })
    this.onboardingCompleted = !!localStorage.getItem("onboarding-completed");
    this.userStateReaction = reaction(()=>mainStore.contract.currentUser, (user)=>{ 
      if(user){
        this.completeOnboarding();
      }
    })
  }

  setDialogOpened(value: boolean) {
    this.dialogOpened = value
    if (value === true) {
      this.requestData()
    }
  }

  async requestData() {
    const data = await this.mainStore.contract.contract.getAll()
    this.setData(data.sort((a: any, b: any) => b.rate - a.rate))
  }

  setData(data: typeof this.data) {
    this.data = data
  }

  completeOnboarding(){
    this.onboardingCompleted = true;
    localStorage.setItem('onboarding-completed', 'true');
  }

  dispose() {
    this.userStateReaction()
  }
}

export default UiStore