import {Pool} from './models/Pool';
import {Unit} from './models/Unit';

export function generatePool(){
  return Pool.generate();
}