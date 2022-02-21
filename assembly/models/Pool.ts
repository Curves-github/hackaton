import { PersistentUnorderedMap, math, context } from "near-sdk-as";
import { Unit } from "./Unit";
import { AccountId } from "../utils";

export const POOLS = new PersistentUnorderedMap<u32, Pool>("p");

class UnitPools{
  unit: u32;
  pools: Pool[];
}

@nearBindgen
export class Pool{
  id: u32;
  options: [u32, u32];
  owner: AccountId;
  vote: u32;
  constructor(units: [u32, u32]){
    this.owner = context.sender;
    this.id = math.hash32<string>(`${this.owner}-${units[0].toString()}:${units[1].toString()}`);
    if(Pool.get(this.id)){
      throw new Error("Pool with this units already exists");
    }
    if(units[0] == units[1]){
      throw new Error("Options")
    }
    this.options = units;
  }
  static insert(units: [u32, u32]): Pool{
    return new Pool(units);
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
  static getPoolsByUnit(unitId: u32): Pool[]{
    const pools = Pool.all();
    const poolsWithUnit:Pool[] = [];
    for (let i = 0; i < pools.length; i++) {
      const pool = pools[i];
      if(pool.options.includes(unitId)){
        poolsWithUnit.push(pool)
      }
    }
    return poolsWithUnit;
  }
  static vote(optionId: u32): void{
    //
  }
}