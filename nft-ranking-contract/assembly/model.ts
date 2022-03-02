// contract/assembly/model.ts
import { math, PersistentSet, datetime, PersistentUnorderedMap, AVLTree } from "near-sdk-as";

export const votes = new PersistentSet<u32>("v")
export const cards = new PersistentUnorderedMap<u32, Card>("c");

export const rateTree = new AVLTree<f64, RateTreeNode>('r');
export const partTree = new AVLTree<f64, PartTreeNode>('p')

const RATE_PRECISION = 2;

class UniqSessionFloat{
  private time: u64
  private count: u64
  constructor(){
    this.time = datetime.block_datetime().epochNanoseconds;
    this.count = 1;
  }
  get():f64{
    const f = <f64>this.time + Math.pow(10, <f64>this.count);
    this.count += 1;
    return f * <f64>Math.pow(10, -this.time.toString().length)
  }
}

const uniqSessionFloat = new UniqSessionFloat();

@nearBindgen
export class RateTreeNode{
  card: u32;
  rate: f32;
}
@nearBindgen
export class PartTreeNode{
  card: u32;
  part: u32;
}



@nearBindgen
export class Vote {
  cardA: Card
  cardB: Card
  timestamp: u64
  constructor(cardA: Card, cardB: Card, timestamp: u64) {
    this.cardA = cardA
    this.cardB = cardB
    this.timestamp = timestamp
  }
}

@nearBindgen
export class Card {
  id: u32
  imgSrc: string
  part: u32
  uniqPart: f64
  // rate: f32 //2 precision (100.03, 100.12)
  uniqRate: f64
  private _rate: f32;

  get rate():f32{
    return this._rate;
  }
  set rate(r:f32){
    this._rate = Mathf.fround(r);
  }

  constructor(id: string, src: string) {
    this.id = math.hash32<string>(id);
    this.imgSrc = src;
    this.part = 0
    this.uniqPart = <f64>this.part + uniqSessionFloat.get()
    this.rate = 100;
    this.uniqRate = <f64>this.rate + uniqSessionFloat.get() * Math.pow(10, -RATE_PRECISION * 10);
  }

  static insert(id: string, src: string): Card {
    const card = new Card(id, src);
    cards.set(card.id, card);
    partTree.insert(card.uniqPart, {
      card: card.id,
      part: card.part
    })
    rateTree.insert(card.uniqRate, {
      card: card.id,
      rate: card.rate
    })


    return card;
  }

  static getAll(): Card[] {
    return cards.values(<u16>Mathf.max(<f32>cards.length-50, 0), cards.length)
  }

  static getLength(): u32 {
    return cards.length
  }

  static currentTimestamp(): u64 {
    return datetime.block_datetime().epochNanoseconds
  }

  static getVoteStamp(a: u32, b: u32, timestamp: u64): u32 {
    return math.hash32(a ^ b ^ timestamp)
  }

  static createVoteStamp(a: u32, b: u32): u64 {
    const timestamp = Card.currentTimestamp()
    votes.add(Card.getVoteStamp(a, b, timestamp))
    return timestamp
  }

  static checkVoteStamp(a: u32, b: u32, timestamp: u64): bool {
    const voteId = Card.getVoteStamp(a, b, timestamp)
    return votes.has(voteId)
  }

  static getTwoCards(): Vote {
    const allCards = Card.getAll()
    let indexA = 0
    let minParticipations = allCards[indexA].part
    for (let i = 1; i < allCards.length; i++) {
      if (allCards[i].part < minParticipations) {
        minParticipations = allCards[i].part
        indexA = i
      }
    }

    let indexB = 0
    let closestRate: f32 = 9999
    for (let i = 0; i < allCards.length; i++) {
      if (i === indexA) continue
      if (Mathf.abs(allCards[i].rate - allCards[indexA].rate) < closestRate) {
        closestRate = Mathf.abs(allCards[i].rate - allCards[indexA].rate)
        indexB = i
      }
    }

    const time = Card.createVoteStamp(allCards[indexA].id, allCards[indexB].id)
    
    return new Vote(allCards[indexA], allCards[indexB], time)
  }

  static vote(a: u32, b: u32, decision: i8, timestamp: u64): bool {
    if (!Card.checkVoteStamp(a, b, timestamp)) {
      return false
    }

    const cardA = cards.getSome(decision < 0? b: a)
    const cardB = cards.getSome(decision < 0? a: b)

    const Ea: f32 = 1 / (1 + Mathf.pow(10, ( cardB.rate - cardA.rate ) / 400))
    const Eb: f32 = 1 / (1 + Mathf.pow(10, ( cardA.rate - cardB.rate ) / 400))

    const Sa: f32 = decision === 0? 0.5: 1
    const Sb: f32 = decision === 0? 0.5: 0

    cardA.rate = cardA.rate + 40 * (Sa - Ea)
    cardB.rate = cardB.rate + 40 * (Sb - Eb)

    cardA.part += 1
    cardB.part += 1

    cards.set(decision < 0? b: a, cardA)
    cards.set(decision < 0? a: b, cardB)

    return true
  }

  static clearAll(): bool {
    cards.clear()
    return true
  }
}