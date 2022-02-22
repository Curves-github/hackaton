import { Pool } from "./models/Pool";
import { Unit } from "./models/Unit";

class UnitUses{
  unit: Unit;
  uses: f64;
}

export function getMustUnusedUnit(units:Unit[]):Unit{
  const unitUses: UnitUses = {unit: units[0], uses:0}
  return units.reduce<UnitUses>((minUnit, unit) => {
    const unitPoolsCount = Pool.getPoolsWithOptionWinner(unit.id).length;
    return unitPoolsCount < minUnit.uses ? {unit: unit, uses: unitPoolsCount} : minUnit;
  }, unitUses).unit;
}

export function getClosestByRate(units:Unit[],target: Unit):Unit{
  const rateDistance = (a:Unit, b:Unit):f64 => Math.abs(a.rate - b.rate);
  let closest = units[0];
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if(rateDistance(target, unit) < rateDistance(target, closest)){
      closest = unit;
    }
  }
  return closest;
}

export function getUnitsInPairWith(target:Unit): u32[]{
  const siblings = Pool.getPoolsByOption(target.id).map<u32[]>(pool=>pool.options).flat();
  const uniqueUnits:u32[] = [];
  for (let i = 0; i < siblings.length; i++) {
    if(siblings[i] != target.id){
      uniqueUnits.push(siblings[i]);
    }
  }
  return uniqueUnits;
}

export function getPoolUnits(poolId: u32): Unit[]{
  const pool = Pool.getSome(poolId);
  const units:Unit[] = [];

  for (let i = 0; i < pool.options.length; i++) {
    const unit = Unit.get(pool.options[i]);
    if(unit != null){
      units.push(unit);
    }
  }
  return units;
}

export function computeRate(units:Unit[],winnerIndex:i8):void{
  const isSkip = winnerIndex == -1;
  const A = units[isSkip ? 0 : winnerIndex];
  const B = units[isSkip ? 1 : (winnerIndex + 1) % 2];

  const Ea = 1 / (1 + Math.pow(10, ( B.rate - A.rate ) / 400));
  const Eb = 1 / (1 + Math.pow(10, ( A.rate - B.rate ) / 400))

  const Sa = isSkip? 0.5: 1;
  const Sb = isSkip? 0.5: 0;

  Unit.setRate(A.id, A.rate + 40 * (Sa - Ea));
  Unit.setRate(B.id, B.rate + 40 * (Sb - Eb));
}