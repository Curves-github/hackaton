import CardsStore from "./cards"
import UiStore from "./ui"

class MainStore {

  ui = new UiStore()
  cards = new CardsStore()

  async init() {
    await this.cards.init()
  }

  dispose() {

  }

}

export default MainStore