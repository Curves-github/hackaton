import { action, makeAutoObservable, makeObservable, observable, toJS } from "mobx"
import ContractStore from "../contract"

type Card = {
  id: number, 
  rate: number, 
  participations: number,
  imgSrc: string
}

class CardsStore {

  private contract: ContractStore
  showed: [ Card, Card ] | null = null
  timestamp: string | null = null

  constructor(contract: ContractStore) {
    this.contract = contract
    makeObservable(this, {
      showed: observable,
      setShowed: action
    })
  }

  async init() {
    console.log("loading...")
    const cards = await this.contract.contract.getTwoCards()
    this.timestamp = cards.timestamp
    console.log(cards)
    this.setShowed([ cards.cardA, cards.cardB ])
    
  }

  async vote(decision: -1 | 0 | 1) {
    if (!this.showed) return
    const a = this.showed[0].id
    const b = this.showed[1].id
    this.setShowed(null)

    await this.contract.contract.vote({ a, b, decision, timestamp: this.timestamp })
    
    this.init()
  }

  setShowed(showed: typeof this.showed) {
    this.showed = showed
  }

}

export default CardsStore