import { makeAutoObservable, observable, toJS } from "mobx"

type Card = {
  id: number, 
  rate: number, 
  participations: number,
  src: string
}

class CardsStore {

  cards = observable.array<Card>()

  showed: [ Card, Card ] | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async init() {
    const cards = await fetch("/nft.json").then(a => a.json())
    this.setCards(cards.map((card: any) => {
      const splited = card.image_url.split("/")
      const ext = splited[splited.length-1].split(".")
      return {
        id: card.id,
        rate: 100,
        participations: 0,
        src: `/images/${card.id}.${ext.length === 1? "png": ext[ext.length-1]}`
      }
    }))
    this.getTwoCards()
  }

  setCards(cards: Card[]) {
    console.log(cards)
    this.cards.replace(cards)
  }

  getTwoCards() {

    
    const undergog = this.cards.reduce((card, currentCard) => (currentCard.participations < card.participations)? currentCard: card)

    const rivalComp = (a: Card) => Math.abs(undergog.rate-a.rate)
    const rival = this.cards.reduce(
      (card, currentCard) => (currentCard !== undergog && (rivalComp(currentCard) < rivalComp(card)))? currentCard: card,
      this.cards[ undergog === this.cards[0]? 1: 0 ] 
    )

    this.showed = [
      undergog,
      rival
    ]
  }

  get sortedCards() {
    return [...this.cards].sort((a, b) => b.rate - a.rate)
  }

  rateCard(i: number, isDraw: boolean = false) {
    if (this.showed === null) return
    const A = this.showed[i]
    const B = this.showed[ i === 0? 1: 0 ]
    const Ea = 1 / (1 + Math.pow(10, ( B.rate - A.rate ) / 400))
    const Eb = 1 / (1 + Math.pow(10, ( A.rate - B.rate ) / 400))

    const Sa = isDraw? 0.5: 1
    const Sb = isDraw? 0.5: 0

    A.rate = A.rate + 40 * (Sa - Ea)
    B.rate = B.rate + 40 * (Sb - Eb)

    A.participations += 1
    B.participations += 1

    console.log({ A: A.rate, B: B.rate, Ea, Eb })

    setTimeout(() => {
      this.getTwoCards()
    }, 20)
  }

}

export default CardsStore