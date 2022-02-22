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