import { PersistentUnorderedMap, math, context } from "near-sdk-as";
import { AccountId } from "../utils";

export const POOLS = new PersistentUnorderedMap<u32, Pool>("p");

@nearBindgen
export class Pool{
  id: u32;
  options: u32[];
  owner: AccountId;
  vote: u32;
  constructor(options: u32[]){
    if(options.length < 2){
      throw new Error("should be at least 2 options")
    }
    this.owner = context.sender;
    this.id = math.hash32<string>(`${this.owner}-${options[0].toString()}:${options[1].toString()}`);
    if(Pool.get(this.id)){
      throw new Error("Pool with this units already exists");
    }
    if(options[0] == options[1]){
      throw new Error("Options")
    }
    this.options = options;
  }
  static insert(options: u32[]): Pool{
    return new Pool(options);
  }
  static get(id: u32): Pool | null{
    return POOLS.get(id)
  }
  static getSome(id: u32): Pool{
    return POOLS.getSome(id)
  }
  static all():Pool[]{
    return POOLS.values();
  }
  static getPoolsByUser(user: AccountId, offset:u32 = 0, limit: u32 = 10): Pool[]{
    const pools = Pool.all();
    const userPools:Pool[] = [];
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if(pool.owner == user){
        userPools.push(pool);
      }
    }
    return userPools.slice(offset, offset+limit);
  }
  static getPoolsByOption(optionId: u32): Pool[]{
    const pools = Pool.all();
    const poolsWithUnit:Pool[] = [];
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if(pool.options.includes(optionId)){
        poolsWithUnit.push(pool)
      }
    }
    return poolsWithUnit;
  }
  static getPoolsWithOptionWinner(optionId: u32): Pool[]{
    const pools = Pool.all();
    const result:Pool[] = [];
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if(pool.vote == optionId){
        result.push(pool)
      }
    }
    return result;
  }
  static vote(optionId: u32): void{
    
  }
  static getUserUnvotedPool(): Pool | null{
    let unvotedPool: Pool | null = null;
    const pools = Pool.all();
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if(pool.owner == context.sender && !pool.vote){
        unvotedPool = pool;
        break;
      }
    }
    return unvotedPool
  }
}