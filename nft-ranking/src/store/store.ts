import CardsStore from "./cards"
import ContractStore from "./contract"
import UiStore from "./ui"

class MainStore {

  champions = new UiStore(this)
  winners = new UiStore(this)
  contract = new ContractStore()
  cards = new CardsStore(this.contract)

  constructor() {
    this.winners.requestData = async () => {
      const data = await this.contract.contract.getWinners()
      console.log(data)
      this.winners.setData(data.sort((a: any, b: any) => b.contribution - a.contribution))
    }
  }

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