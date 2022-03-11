import CardsStore from "./cards"
import ContractStore from "./contract"
import UiStore from "./ui"

class MainStore {

  contract = new ContractStore()
  cards = new CardsStore(this.contract)
  ui = new UiStore(this)

  async init() {
    await this.contract.initContract()
  }

  dispose() {
    this.ui?.dispose();
  }

}

export default MainStore