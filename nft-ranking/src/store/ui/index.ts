import { action, makeAutoObservable, observable } from "mobx"
import MainStore from "../store"

class UiStore {
  private mainStore: MainStore
  dialogOpened = false
  loading = false
  data: any[] | null = null
  onboardingCompleted = false

  constructor(mainStore: MainStore) {
    this.mainStore = mainStore
    makeAutoObservable(this, {
      dialogOpened: observable,
      loading: observable,
      data: observable,
      onboardingCompleted: observable,
      setDialogOpened: action,
      setData: action,
    })
    this.onboardingCompleted = !!localStorage.getItem("onboarding-completed");
  }

  setDialogOpened(value: boolean) {
    this.dialogOpened = value
    if (value === true) {
      this.requestData()
    }
  }

  async requestData() {
    const data = await this.mainStore.contract.contract.getAll()
    console.log(data)
    this.setData(data.sort((a: any, b: any) => b.rate - a.rate))
  }

  setData(data: typeof this.data) {
    this.data = data
  }

  completeOnboarding(){
    this.onboardingCompleted = true;
    localStorage.setItem('onboarding-completed', 'true');
  }
}

export default UiStore