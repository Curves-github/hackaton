import { getUnitsInPairWith, getMustUnusedUnit, getClosestByRate, getPoolUnits, computeRate } from './helpers';
import {Pool} from './models/Pool';
import {Unit} from './models/Unit';


export function generatePool(): Pool{
  const unvotedPool = Pool.getUserUnvotedPool();
  if(unvotedPool){
    return unvotedPool;
  }
  const units = Unit.all();
  const mostUnusedUnit = getMustUnusedUnit(units);
  const forbiddenUnitsIds = getUnitsInPairWith(mostUnusedUnit);

  const restUnits: Unit[] = [];
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if(unit.id == mostUnusedUnit.id || forbiddenUnitsIds.includes(unit.id)) continue;
    restUnits.push(unit);
  }
  if(restUnits.length == 0){
    throw new Error("Unique units pair not found")
  }
  const rival = getClosestByRate(restUnits, mostUnusedUnit);

  return Pool.insert([mostUnusedUnit.id, rival.id]);
}

export function skipPool(poolId: u32): void{
  Pool.skip(poolId);
  const poolUnits = getPoolUnits(poolId);
  computeRate(poolUnits, -1);
}

export function vote(poolId: u32, optionId: u32): void{
  Pool.vote(poolId, optionId);
  const poolUnits = getPoolUnits(poolId);
  const index:i8 = poolUnits[0].id == optionId ? 0 : 1;
  computeRate(poolUnits, index);
}