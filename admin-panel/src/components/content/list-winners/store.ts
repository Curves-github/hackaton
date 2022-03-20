import { makeAutoObservable } from "mobx";
import ContractStore from "../../../store/contract";

class ListNftStore {
  
  private contractStore: ContractStore
  winners: { accountId: string, contribution: number, normalizeContribution: number, clicks: number }[] = []

  constructor(contractStore: ContractStore) {
    this.contractStore = contractStore
    makeAutoObservable(this)
  }

  async init() {
    const arr = await this.contractStore.contract.getWinners()
    arr.sort((a: any, b: any) => b.normalizeContribution - a.normalizeContribution)

    this.setWinners(arr)
  }

  setWinners(winners: typeof this.winners) {
    this.winners = winners
  }

}

export default ListNftStore