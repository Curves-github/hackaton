import {Pool} from './models/Pool';
import {Unit, UNITS} from './models/Unit';


function getMinUsedUnit(units:Unit[]):Unit{
  return units.reduce<{unit:Unit, uses:u32}>((minUnit, unit) => {
    const unitPoolsCount = Pool.getPoolsByUnit(unit.id).length;
    return unitPoolsCount < minUnit.uses ? {unit: unit, uses: unitPoolsCount} : minUnit;
  }, {unit: units[0], uses:0}).unit;
}

function getClosestByRate(units:Unit[],target: Unit):Unit{
  const rateDistance = (a:Unit, b:Unit)=>Math.abs(a.rate - b.rate);
  let closest = units[0];
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if(rateDistance(target, unit) < rateDistance(target, closest)){
      closest = unit;
    }
  }
  return closest;
}
function getUnitsInPairWith(target:Unit): u32[]{
  const siblings = Pool.getPoolsByUnit(target.id).map(pool=>pool.options).flat();
  const uniqueUnits:u32[] = [];
  for (let i = 0; i < siblings.length; i++) {
    if(siblings[i] != target.id){
      uniqueUnits.push(siblings[i]);
    }
  }
  return uniqueUnits;
}

export function generatePool(): Pool{
  const units = UNITS.values();
  const mostUnusedUnit = getMinUsedUnit(units);
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