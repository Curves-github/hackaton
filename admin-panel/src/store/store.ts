
import ContractStore from "./contract"

class MainStore {

  contract = new ContractStore()

  constructor() {

  }

  async init() {
    await this.contract.initContract()
  }

  dispose() {
    
  }

}

export default MainStore