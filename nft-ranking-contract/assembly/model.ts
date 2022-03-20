// contract/assembly/model.ts
import { math, PersistentSet, datetime, PersistentUnorderedMap, PersistentMap, PersistentVector } from "near-sdk-as";
import { User } from "./model-history";

export const votes = new PersistentSet<u32>("votes")

export const cardIds = new PersistentVector<u32>("card-ids")
export const cards = new PersistentMap<u32, Card>("cards");
export const cardsInfo = new PersistentMap<u32, CardInfo>("cardsInfo")

@nearBindgen
export class CardInfo {
  id: u32
  imgSrc: string
  url: string

  constructor(id: u32, imgSrc: string, url: string) {
    this.id = id
    this.imgSrc = imgSrc
    this.url = url
  }

  static getAll(): CardInfo[] {
    const arr: CardInfo[] = []
    for (let i = 0; i < cardIds.length; i++) {
      arr.push(cardsInfo.getSome(cardIds[i]))
    }
    return arr
  }
}

@nearBindgen
export class Card {
  id: u32
  rate: f32
  participations: u32

  constructor(id: string) {
    this.id = math.hash32<string>(id);
    this.rate = 100
    this.participations = 0
  }

  static insert(id: string, imgSrc: string, url: string): CardInfo {

    const card = new Card(id);
    cards.set(card.id, card);
    cardIds.push(card.id)

    const cardInfo = new CardInfo(card.id, imgSrc, url)
    cardsInfo.set(card.id, cardInfo)
    
    return cardInfo;
  }

  static getAll(): Card[] {
    const arr: Card[] = []
    for (let i = 0; i < cardIds.length; i++) {
      arr.push(cards.getSome(cardIds[i]))
    }
    return arr
  }

  static getLength(): u32 {
    return cardIds.length
  }

  static currentTimestamp(): u64 {
    return datetime.block_datetime().epochNanoseconds
  }

  static getTwoCards(): CardInfo[] {
    const allCards = Card.getAll()
    let indexA = 0
    let minParticipations = allCards[indexA].participations
    for (let i = 1; i < allCards.length; i++) {
      if (allCards[i].participations < minParticipations) {
        minParticipations = allCards[i].participations
        indexA = i
      }
    }

    let indexB = 0
    let closestRate: f32 = 9999
    for (let i = 0; i < allCards.length; i++) {
      if (i === indexA) continue
      if (abs(allCards[i].rate - allCards[indexA].rate) < closestRate) {
        closestRate = abs(allCards[i].rate - allCards[indexA].rate)
        indexB = i
      }
    }

    return [ cardsInfo.getSome(allCards[indexA].id), cardsInfo.getSome(allCards[indexB].id) ]
  }

  static vote(a: u32, b: u32, decision: i8): bool {

    const cardA = cards.getSome(decision < 0? b: a)
    const cardB = cards.getSome(decision < 0? a: b)

    const Ea: f32 = 1 / (1 + Mathf.pow(10, ( cardB.rate - cardA.rate ) / 400))
    const Eb: f32 = 1 / (1 + Mathf.pow(10, ( cardA.rate - cardB.rate ) / 400))

    const Sa: f32 = decision === 0? 0.5: 1
    const Sb: f32 = decision === 0? 0.5: 0

    cardA.rate = cardA.rate + 40 * (Sa - Ea)
    cardB.rate = cardB.rate + 40 * (Sb - Eb)

    cardA.participations += 1
    cardB.participations += 1

    cards.set(decision < 0? b: a, cardA)
    cards.set(decision < 0? a: b, cardB)
    
    const user = User.current()
    if (decision !== 0) {
      User.voteCard(user, cardA)
    }

    return true
  }

  static clearAll(): bool {
    while(cardIds.length > 0) {
      cards.delete(cardIds[cardIds.length-1])
      cardsInfo.delete(cardIds[cardIds.length-1])
      cardIds.pop()
    }
    return true
  }
}