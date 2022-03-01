import { action, makeAutoObservable, observable } from "mobx"
import MainStore from "../store"

class UiStore {
  private mainStore: MainStore
  dialogOpened = false
  loading = false
  data: any[] | null = null

  constructor(mainStore: MainStore) {
    this.mainStore = mainStore
    makeAutoObservable(this, {
      dialogOpened: observable,
      loading: observable,
      data: observable,
      setDialogOpened: action,
      setData: action
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
    console.log(data)
    this.setData(data.sort((a: any, b: any) => b.rate - a.rate))
  }

  setData(data: typeof this.data) {
    this.data = data
  }

}

export default UiStore