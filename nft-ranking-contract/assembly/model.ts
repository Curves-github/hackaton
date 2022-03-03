// contract/assembly/model.ts
import { math, PersistentSet, datetime, PersistentUnorderedMap, AVLTree } from "near-sdk-as";

export const votes = new PersistentSet<u32>("v")
export const cards = new PersistentUnorderedMap<u32, Card>("c");

export const rateTree = new AVLTree<f64, RateTreeNode>('r');
export const partTree = new AVLTree<f64, PartTreeNode>('p')

const RATE_PRECISION = 1;

class UniqSessionFloat{
  private time: u64
  private count: u64
  constructor(){
    this.time = datetime.block_datetime().epochNanoseconds;
    this.count = 1;
  }
  get():f64{
    const hash = math.hash32<string>(`${this.time.toString()} - ${this.count.toString()}`);
    // const f = <f64>this.time + Math.pow(10, <f64>this.count);
    this.count += 1;
    return hash * Math.pow(10, -hash.toString().length);
    // return f * <f64>Math.pow(10, -this.time.toString().length)
  }
  static SIZE:u8 = 10;
}

const uniqSessionFloat = new UniqSessionFloat();

@nearBindgen
export class RateTreeNode{
  card: u32;
  rate: f32;  // Можно удалить, нет необходимости
}
@nearBindgen
export class PartTreeNode{
  card: u32; 
  part: u32;  // Можно удалить, нет необходимости
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
  uniqPart: f64 // same as part, but with fractional(ex: part=10, uniqPart=10.02342; part=20, uniqPart=20.234)
  uniqRate: f64 // same as rate, but with fractional(ex: rate=100.3, uniqRate=100.12343; rate=123.9, uniqRate=123.52341)
  private _rate: f32;
  private _part: u32;

  get part():u32{
    return this._part;
  }

  set part(p:u32){
    this._part = p;
    this.uniqPart = <f64>p + uniqSessionFloat.get();
  }

  get rate():f32{
    return this._rate;
  }
  set rate(r:f32){
    this.uniqRate = <f64>r + uniqSessionFloat.get() * Math.pow(10, -RATE_PRECISION);
    this._rate = Mathf.fround(r);
  }

  constructor(id: string, src: string) {
    this.id = math.hash32<string>(id);
    this.imgSrc = src;
    this.part = 0
    this.rate = 100;
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

  static getClosestRateCard(card: Card){
    const rateKey = card.uniqRate;

    // дробная часть всегда одинаковой длинны у rate,
    // добавляя к еще одно число в конец, мы всегда будем больше текущего, но меньше остальных
    const ratePrecisionPart = Math.pow(10,rateKey.toString().length);
    let lowerRateKey: f64 | null = null;
    try {
      lowerRateKey = rateTree.lower(rateKey + ratePrecisionPart);
    } catch(err){}
    let higherRateKey: f64 | null = null;
    try {
      higherRateKey = rateTree.higher(rateKey - ratePrecisionPart);
    } catch(err){}

    let closestRateKey: f64 | null = null;

    if(lowerRateKey && higherRateKey){
      closestRateKey = Math.abs(rateKey - lowerRateKey) > Math.abs(rateKey - higherRateKey) ? higherRateKey : lowerRateKey;  
    } else{
      closestRateKey = lowerRateKey || higherRateKey;
    }

    if(!closestRateKey){
      throw new Error('Closest not found');
    }
    
    const closestRateTreeNode = rateTree.getSome(closestRateKey);
    const closestRateCard = cards.getSome(closestRateTreeNode.card);

    return closestRateCard;
  }

  static getTwoCards(): Vote {
    const minUniqPart = partTree.min();
    const minPartTreeNode = partTree.getSome(minUniqPart);
    const cardWithMinPart = cards.getSome(minPartTreeNode.card);
    const cardClosestByRate = Card.getClosestRateCard(cardWithMinPart);
   


    const time = Card.createVoteStamp(cardWithMinPart.id, cardClosestByRate.id)
    
    return new Vote(cardWithMinPart, cardClosestByRate, time)
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

    
    partTree.delete(cardA.uniqPart)
    partTree.delete(cardB.uniqPart)
    rateTree.delete(cardA.uniqRate)
    rateTree.delete(cardB.uniqRate)

    cardA.rate = cardA.rate + 40 * (Sa - Ea)
    cardB.rate = cardB.rate + 40 * (Sb - Eb)

    cardA.part += 1
    cardB.part += 1

    //UPDATE TREE
    
    partTree.insert(cardA.uniqRate, {
      card: cardA.id,
      part: cardA.part
    })
    partTree.insert(cardB.uniqRate, {
      card: cardB.id,
      part: cardB.part
    })


    cards.set(decision < 0? b: a, cardA)
    cards.set(decision < 0? a: b, cardB)

    return true
  }


  static clearAll(): bool {
    cards.clear()
    return true
  }
}