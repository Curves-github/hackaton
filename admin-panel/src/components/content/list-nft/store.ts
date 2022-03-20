import { makeAutoObservable } from "mobx";
import ContractStore from "../../../store/contract";

class ListNftStore {
  
  private contractStore: ContractStore
  cards: { rate: number, id: number, url: string, imgSrc: string, participations: number }[] = []

  constructor(contractStore: ContractStore) {
    this.contractStore = contractStore
    makeAutoObservable(this)
  }

  async init() {
    const cards = await this.contractStore.contract.getAll()
    const cardRates = await this.contractStore.contract.getAllRates()
    
    const arr = []
    for (let i = 0; i < cards.length; i++) {
      arr.push({ ...cards[i], ...cardRates[i] })
    }

    arr.sort((a, b) => b.rate - a.rate)
    this.setCards(arr)
  }

  setCards(cards: typeof this.cards) {
    this.cards = cards
  }

}

export default ListNftStore