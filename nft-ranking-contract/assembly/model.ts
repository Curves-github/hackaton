// contract/assembly/model.ts
import { math, PersistentSet, datetime, PersistentUnorderedMap, AVLTree, context } from "near-sdk-as";

export const pairsHashes = new PersistentSet<u32>("ph")
export const cards = new PersistentUnorderedMap<u32, Card>("c");
//мы не знаем какие карточки в финале будут самые рейтинговые, по этому сохраняем все
//но мы можем понимать какие юзеры внесут максимальный вклад(те у которых минимальный initialRate)
//можем еще отдельно для каждого дерева сохранять min/max 
export const cardsTopVotes = new PersistentUnorderedMap<u32, VoteGroup>('v');

export const rates = new AVLTree<f64, u32>('r');
export const parts = new AVLTree<f64, u32>('p')

const RATE_PRECISION = 1;
const MAX_VOTES_PER_CARD = 5;
const MAX_VOTES = 5;

@nearBindgen
class VoteGroup{
  maxInitialRateIndex: u16;
  maxInitialRateValue: f64;
  votes:Vote[]

  constructor(maxInitialRateIndex:u16, maxInitialRateValue:f64, votes:Vote[]){
    this.maxInitialRateIndex = maxInitialRateIndex;
    this.maxInitialRateValue = maxInitialRateValue;
    this.votes = votes;
  }

  static insert(card: u32, maxInitialRateIndex:u16, maxInitialRateValue:f64, votes:Vote[]): VoteGroup{
    const voteGroup = new VoteGroup(maxInitialRateIndex,maxInitialRateValue, votes);
    cardsTopVotes.set(card, voteGroup);
    return voteGroup;
  }

  static addVote(card:u32, vote:Vote):void{
    let voteGroup = cardsTopVotes.get(card);
    if(!voteGroup){
      voteGroup = VoteGroup.insert(card,0,vote.initialRate,[vote]);
      return;
    }
    // если vote.initialRate больше максимального рейта в списке - значит этот vote никогда не войдет в топ победителей
    if(voteGroup.votes.length >= MAX_VOTES_PER_CARD && vote.initialRate >= voteGroup.maxInitialRateValue){
      return;
    }

    if(voteGroup.votes.length < MAX_VOTES_PER_CARD){
      voteGroup.votes.push(vote);
      const votes = voteGroup.votes;
      //вычисляем новый индекс и рейт
      let maxValueIndex:u16 = 0;
      for (let i:u16 = 1; i < u16(votes.length); i++) {
        const vote = votes[i];
        if(vote.initialRate > votes[maxValueIndex].initialRate){
          maxValueIndex = i;
        }
      }
      voteGroup.maxInitialRateIndex = maxValueIndex;
      voteGroup.maxInitialRateValue = votes[maxValueIndex].initialRate;
    } else if(vote.initialRate < voteGroup.maxInitialRateValue) {
      // индекс не изменился, только рейт
      voteGroup.votes[voteGroup.maxInitialRateIndex];
      voteGroup.maxInitialRateValue = vote.initialRate;
    }
    cardsTopVotes.set(card, voteGroup);
  }
}

@nearBindgen
class Vote{
  userAccount: string;
  initialRate: f64;

  constructor(userAccount: string, initialRate: f64){
    this.userAccount = userAccount;
    this.initialRate = initialRate;
  }
}

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
export class Card {
  id: u32
  imgSrc: string
  private _rate: f32;
  private _part: u32;

  get part():u32{
    return this._part;
  }

  set part(p:u32){
    this._part = <f64>p + uniqSessionFloat.get();
  }

  get rate():f32{
    return this._rate;
  }
  set rate(r:f32){
    this._rate = Mathf.fround(r) + uniqSessionFloat.get() * Math.pow(10, -RATE_PRECISION);
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
    parts.insert(card.rate, card.id);
    rates.insert(card.rate, card.id);
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

  static getClosestRateCard(card: Card):Card{
    // дробная часть всегда одинаковой длинны у rate,
    // добавляя к еще одно число в конец, мы всегда будем больше текущего, но меньше остальных
    const rateKey = card.rate;
    const ratePrecisionPart = Math.pow(10,rateKey.toString().length);
    let lowerRateKey: f64 = 0;
    //TODO: избавиться от try/catch(это не поддерживается), проерять через min
    try {
      lowerRateKey = rates.lower(rateKey + ratePrecisionPart);
    } catch(err){
      const a = err;
    }
    let higherRateKey: f64 = 0;
    //TODO: избавиться от try/catch(это не поддерживается), проерять через max
    try {
      higherRateKey = rates.higher(rateKey - ratePrecisionPart);
    } catch(err){
      const a = err;
    }

    let closestRateKey: f64 = 0;

    if(lowerRateKey && higherRateKey){
      closestRateKey = Math.abs(rateKey - lowerRateKey) > Math.abs(rateKey - higherRateKey) ? higherRateKey : lowerRateKey;  
    } else{
      closestRateKey = lowerRateKey || higherRateKey;
    }

    if(closestRateKey == 0){
      throw new Error('Closest not found');
    }
    
    const closestratesNode = rates.getSome(closestRateKey);
    const closestRateCard = cards.getSome(closestratesNode);

    return closestRateCard;
  }

  static getTwoCards(): Pair {
    const minUniqPart = parts.min();
    const minPartCardId = parts.getSome(minUniqPart);
    const minPartCard = cards.getSome(minPartCardId);
    const cardClosestByRate = Card.getClosestRateCard(minPartCard);
   
    const time = Card.createPairStamp(minPartCard.id, cardClosestByRate.id)
    
    return new Pair(minPartCard, cardClosestByRate, time)
  }

  static vote(a: u32, b: u32, decision: i8, timestamp: u64): bool {
    if (!Card.checkPairStamp(a, b, timestamp)) {
      return false
    }

    const cardA = cards.getSome(decision < 0? b: a)
    const cardB = cards.getSome(decision < 0? a: b)

    const Ea: f32 = 1 / (1 + Mathf.pow(10, ( cardB.rate - cardA.rate ) / 400))
    const Eb: f32 = 1 / (1 + Mathf.pow(10, ( cardA.rate - cardB.rate ) / 400))

    const Sa: f32 = decision === 0? 0.5: 1
    const Sb: f32 = decision === 0? 0.5: 0

    const newRateA = cardA.rate + 40 * (Sa - Ea)
    const newRateB = cardB.rate + 40 * (Sb - Eb)
    const newPartA = cardA.part + 1;
    const newPartB = cardB.part + 1;

    rates.delete(cardB.rate)
    rates.delete(cardA.rate)
    rates.insert(newRateA, cardB.id)
    rates.insert(newRateB, cardB.id)

    parts.delete(cardA.part)
    parts.delete(cardB.part)
    parts.insert(newPartA, cardA.id)
    parts.insert(newPartB, cardB.id)

    // если есть победитель - ему ставим его наименьший рейтинг
    // если победителя нет - тогда "штрафуем" пользователя ставя initialRate в голосвание - усредненное
    // ставим Больший initial рейт для карточек, чтобы выигрыш/шанс был меньше.
    if(decision != 0){
      Card.setVote(cardA.id, cardA.rate);
    } else {
      Card.setVote(cardA.id, Math.max(newRateA, cardA.rate));
      Card.setVote(cardB.id, Math.max(newRateB, cardB.rate));
    }
    

    cardA.rate = newRateA;
    cardB.rate = newRateB;
    cardA.part = newPartA;
    cardB.part = newPartB;
    cards.set(decision < 0? b: a, cardA)
    cards.set(decision < 0? a: b, cardB)

    return true
  }

  static setVote(card:u32, initialRate:f64):void{
    const vote = new Vote(context.sender, initialRate);
    VoteGroup.addVote(card, vote);
    
  }


  static clearAll(): bool {
    cards.clear()
    return true
  }
}