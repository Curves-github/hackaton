import CardsStore from "./cards"
import ContractStore from "./contract"
import UiStore from "./ui"

class MainStore {

  contract = new ContractStore()
  cards = new CardsStore(this.contract)
  champions = new UiStore(this)
  winners = new UiStore(this)
  ui = new UiStore(this)

  constructor() {
    this.winners.requestData = async () => {
      const data = await this.contract.contract.getWinners()
      console.log(data)
      this.winners.setData(data.sort((a: any, b: any) => b.contribution - a.contribution))
    }
  }

  async init() {
    await this.contract.initContract()
  }

  dispose() {
    this.ui?.dispose();
  }

}

export default MainStore