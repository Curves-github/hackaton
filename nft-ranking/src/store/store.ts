import CardsStore from "./cards"
import ContractStore from "./contract"
import UiStore from "./ui"

class MainStore {

  ui = new UiStore(this)
  contract = new ContractStore()
  cards = new CardsStore(this.contract)

  async init() {
    await this.contract.initContract()
    if (!this.contract.currentUser){
      return
    }
    await this.cards.init()
  }

  dispose() {

  }

}

export default MainStore