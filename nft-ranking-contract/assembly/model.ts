// contract/assembly/model.ts
import { math, PersistentSet, datetime, PersistentUnorderedMap, AVLTree, context } from "near-sdk-as";

export const pairsHashes = new PersistentSet<u32>("h")
export const cardsMeta = new PersistentUnorderedMap<u32, CardMeta>("m");
export const cardsToRate = new PersistentUnorderedMap<u32, f64>("r");
export const cardsToPart = new PersistentUnorderedMap<u32, f64>("p");
//  можно сохранять максимально 5 элементов, когда пришел 6ой - каждый бросает кубик(ранд), выбывает наименьший
//  правда тогда чем раньше ты попал в массив для этой карточки, тем сложнее тебе там остаться
export const cardsTopVotes = new PersistentUnorderedMap<u32, u32[]>('v');  

export const rates = new AVLTree<f64, u32>('r');
export const parts = new AVLTree<f64, u32>('p')

const RATE_PRECISION = 3;
const MAX_VOTES_PER_CARD = 5;
const MAX_VOTES = 5;


class UniqSessionFloat{
  private time: u64
  private count: u64
  constructor(){
    this.time = datetime.block_datetime().epochNanoseconds;
    this.count = 1;
  }
  get():f64{
    const hash = math.hash32<string>(`${this.time.toString()} - ${this.count.toString()}`);
    this.count += 1;
    return hash * Math.pow(10, -hash.toString().length);
  }
  static SIZE:u8 = 10;
}


const uniqSessionFloat = new UniqSessionFloat();


@nearBindgen
export class Pair {
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
export class CardRate{
  static getUniqRate(rate:f64):f64{
    const rounedRate = Math.round(rate * Math.pow(10, RATE_PRECISION));
    return (rounedRate + uniqSessionFloat.get()) * Math.pow(10, -RATE_PRECISION);
  }
  static insert(card:u32, rate:f64=100):f64{
    const uniqRate = CardRate.getUniqRate(rate);
    cardsToRate.set(card, uniqRate);
    rates.insert(uniqRate, card);

    return uniqRate;
  }
  static getByCard(card:u32):f64 | null{
    return cardsToRate.get(card);
  }
  static getSomeByCard(card:u32):f64{
    return cardsToRate.getSome(card);
  }
  static getByRate(rate:f64): u32 | null{
    return rates.get(rate);
  }
  static getSomeByRate(rate:f64): u32{
    return rates.getSome(rate);
  }
  static update(card:u32, oldRate:f64, newRate:f64):f64{
    const uniqNewRate = CardRate.getUniqRate(newRate);
    cardsToRate.set(card, uniqNewRate);
    rates.delete(oldRate);
    rates.insert(uniqNewRate, card);
    return uniqNewRate
  }
  static minRate():f64{
    return rates.min()
  }
  static maxRate():f64{
    return rates.max();
  }
  static lowerRate(target:f64):f64{
    return rates.lower(target);
  }
  static higherRate(target:f64):f64{
    return rates.higher(target);
  }
}

@nearBindgen
export class CardPart{
  static getUniqPart(part:f64):f64{
    return Math.trunc(part) + uniqSessionFloat.get();
  }
  static insert(card:u32, part:f64=0):f64{
    const uniqPart = CardPart.getUniqPart(part);
    cardsToPart.set(card, uniqPart);
    parts.insert(uniqPart, card);
    return uniqPart;
  }

  static getByCard(card:u32):f64 | null{
    return cardsToPart.get(card);
  }
  static getSomeByCard(card:u32):f64{
    return cardsToPart.getSome(card);
  }
  static getByPart(part:u32):f64 | null{
    return parts.get(part);
  }
  static getSomeByPart(part:u32):f64{
    return parts.getSome(part);
  }
  static update(card:u32,oldPart:f64,newPart:f64):f64{
    const uniqNewPart = CardPart.getUniqPart(newPart);
    cardsToPart.set(card, uniqNewPart);
    parts.delete(oldPart);
    parts.insert(uniqNewPart, card);

    return uniqNewPart
  }
  static minPart():f64{
    return parts.min();
  }
}

@nearBindgen
export class CardMeta{
  id: u32;
  imgSrc: string;

  constructor(id: string, src: string){
    this.id = math.hash32<string>(id);
    this.imgSrc = src;
  }

  static insert(id: string, src: string): CardMeta{
    const card = new CardMeta(id, src);
    cardsMeta.set(card.id, card);
    return card;
  }

  static get(id: u32): CardMeta|null{
    return cardsMeta.get(id);
  }
  static getSome(id: u32): CardMeta{
    return cardsMeta.getSome(id);
  }
}

@nearBindgen
export class Card {
  meta: CardMeta;
  rate: f64;
  part: f64;
  
  static insert(id: string, src: string): Card {
    const meta = CardMeta.insert(id, src);
    const rate = CardRate.insert(meta.id);
    const part = CardPart.insert(meta.id);
    return {
      meta,
      rate,
      part
    }
  }

  static currentTimestamp(): u64 {
    return datetime.block_datetime().epochNanoseconds
  }

  static getPairStamp(a: u32, b: u32, timestamp: u64): u32 {
    return math.hash32(a ^ b ^ timestamp)
  }

  static createPairStamp(a: u32, b: u32): u64 {
    const timestamp = Card.currentTimestamp()
    pairsHashes.add(Card.getPairStamp(a, b, timestamp))
    return timestamp
  }

  static checkPairStamp(a: u32, b: u32, timestamp: u64): bool {
    const voteId = Card.getPairStamp(a, b, timestamp)
    return pairsHashes.has(voteId)
  }

  static getClosestRateCard(card: u32):u32{
    // дробная часть всегда одинаковой длинны у rate,
    // добавляя к еще одно число в конец, мы всегда будем больше текущего, но меньше остальных
    const targetRate = CardRate.getSomeByCard(card)
    const ratePrecisionPart = Math.pow(10,targetRate.toString().length);
    const lowerThan = targetRate + ratePrecisionPart;
    const lowerRateKey:f64 = lowerThan > CardRate.minRate() ? CardRate.lowerRate(lowerThan) : 0; //плохо конечно на это полагаться, но в текущей реализации рейт не может быть нулем
    
    const higherThan = targetRate - ratePrecisionPart
    const higherRateKey:f64 = higherThan < CardRate.maxRate() ? CardRate.higherRate(higherThan) : 0; 

    let closestRateKey: f64 = 0;

    if(!lowerRateKey && !higherRateKey){
      throw new Error('Closest not found');
    } 
    
    if(lowerRateKey && higherRateKey){
      closestRateKey = Math.abs(targetRate - lowerRateKey) > Math.abs(targetRate - higherRateKey) ? higherRateKey : lowerRateKey;  
    } else{
      closestRateKey = lowerRateKey || higherRateKey;
    }

    
    const closestRateCardId = CardRate.getSomeByRate(closestRateKey);

    return closestRateCardId;
  }

  static getTwoCards(): Pair {
    const minUniqPart = CardPart.minPart();
    const minPartCardId = CardPart.getSomeByPart(minUniqPart);
    const cardClosestByRate = Card.getClosestRateCard(minPartCardId);
   
    const time = Card.createPairStamp(minPartCardId, cardClosestByRate)
    
    const cardA = Card.getSome(minPartCardId);
    const cardB = Card.getSome(cardClosestByRate);

    return new Pair(cardA, cardB, time)
  }

  static vote(a: u32, b: u32, decision: i8, timestamp: u64): bool {
    if (!Card.checkPairStamp(a, b, timestamp)) {
      return false
    }

    let cardA = decision < 0? b: a;
    let cardB = decision < 0? a: b;
    const rateA = CardRate.getSomeByCard(cardA)
    const rateB = CardRate.getSomeByCard(cardB)
    const partA = CardPart.getSomeByCard(cardA)
    const partB = CardPart.getSomeByCard(cardB)
    

    const Ea: f64 = 1 / (1 + Math.pow(10, ( rateB - rateA ) / 400))
    const Eb: f64 = 1 / (1 + Math.pow(10, ( rateA - rateB ) / 400))

    const Sa: f64 = decision == 0 ? 0.5 : 1
    const Sb: f64 = decision == 0 ? 0.5 : 0

    const newRateA = rateA + 40 * (Sa - Ea)
    const newRateB = rateB + 40 * (Sb - Eb)
    const newPartA = partA + 1;
    const newPartB = partB + 1;

    CardRate.update(cardA, rateA, newRateA);
    CardRate.update(cardB, rateB, newRateB);
    CardPart.update(cardA, partA, newPartA);
    CardPart.update(cardB, partB, newPartB)

    // если есть победитель - ему ставим его наименьший рейтинг
    // если победителя нет - тогда "штрафуем" пользователя ставя initialRate в голосвание - усредненное
    // ставим Больший initial рейт для карточек, чтобы выигрыш/шанс был меньше.
    // if(decision != 0){
    //   Card.setVote(cardA, cardA.rate);
    // } else {
    //   Card.setVote(cardA.id, Math.max(newRateA, cardA.rate));
    //   Card.setVote(cardB.id, Math.max(newRateB, cardB.rate));
    // }
    
    // cards.set(decision < 0? b: a, cardA)
    // cards.set(decision < 0? a: b, cardB)

    return true;
  }

  static setVote(card:u32, initialRate:f64):void{

    // const vote = new Vote(context.sender, initialRate);
    // VoteGroup.addVote(card, vote);
  }

  static get(card:u32): Card | null{
    const meta = CardMeta.get(card);
    const part = CardPart.getByCard(card);
    const rate = CardRate.getByRate(card);
    if(meta == null || part == null || rate == null){
      return null
    }
    return {
      meta,
      part,
      rate
    }
  }
  static getSome(card:u32):Card{
    return {
      meta: CardMeta.getSome(card),
      part: CardPart.getSomeByCard(card),
      rate: CardRate.getSomeByRate(card),
    }
  }
}

