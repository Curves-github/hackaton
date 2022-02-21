import { PersistentUnorderedMap, math } from "near-sdk-as";

export const UNITS = new PersistentUnorderedMap<u32, Unit>("u");

@nearBindgen
export class Unit{
  id: u32;
  url: string;  
  owner: string;
  rate: u32; //TODO: create Rate model?
  constructor(url: string, owner: string, initialRate:u32 = 100){
    this.id = math.hash32<string>(url);
    if(Unit.get(this.id)){
      throw "Unit with this url already exist";
    }
    this.url = url;
    this.owner = owner;
  }
  static add(url: string, owner: string){
    const unit = new Unit(url, owner);
    UNITS.set(unit.id, unit);
    return unit;
  }
  static get(id: u32){
    return UNITS.get(id);
  }
  static getSome(id: u32){
    return UNITS.getSome(id);
  }
  static getByOwner(owner: string){
    const filteredUnits = [];
    const values = UNITS.values();
    for (let i = 0; i < values.length; i++) {
       const unit = values[i];
       if(unit.owner == owner){
         filteredUnits.push(unit)
       }
    }
    return filteredUnits;
  }
  static setRate(id: u32, rate: u32){
    const unit = Unit.getSome(id);
    unit.rate = rate;
    UNITS.set(unit.id, unit);
  }
}