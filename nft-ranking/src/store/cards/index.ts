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
  clicksLeft = 0

  constructor(contract: ContractStore) {
    this.contract = contract
    makeObservable(this, {
      showed: observable,
      clicksLeft: observable,
      setShowed: action,
      setClicksLeft: action
    })
  }

  async init() {
    console.log("loading...")
    const cards = await this.contract.contract.getTwoCards()
    this.timestamp = cards.timestamp
    console.log(cards)
    this.setShowed(cards)
    this.setClicksLeft(parseInt(window.localStorage.getItem("clicksLeft") || "") || 40)
  }

  async vote(decision: -1 | 0 | 1) {
    if (!this.showed) return
    const a = this.showed[0].id
    const b = this.showed[1].id
    this.setShowed(null)
    
    await this.contract.contract.vote({ a, b, decision, timestamp: this.timestamp }, "50000000000000")
    this.setClicksLeft(this.clicksLeft-1)
    this.init()
  }

  setShowed(showed: typeof this.showed) {
    this.showed = showed
  }

  setClicksLeft(clicksLeft: number) {
    this.clicksLeft = clicksLeft
    window.localStorage.setItem("clicksLeft", clicksLeft.toString())
    if (clicksLeft === 0) {
      this.contract.signOut()
    }
  }

}

export default CardsStore