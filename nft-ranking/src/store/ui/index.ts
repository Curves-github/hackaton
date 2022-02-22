import { makeAutoObservable } from "mobx"

class UiStore {

  dialogOpened = false
  currentToolPanelTab = 0

  constructor() {
    makeAutoObservable(this)
  }

  setDialogOpened(value: boolean) {
    this.dialogOpened = value
  }

  setCurrentToolPanelTab(currentToolPanelTab: number) {
    this.currentToolPanelTab = currentToolPanelTab
  }

}

export default UiStore