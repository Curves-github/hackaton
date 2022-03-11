import {  addHours, subHours } from 'date-fns'
import poolAvatar from '../../assets/pool-owners/opensea.png';

export type Filter = {
  id: number;
  label: string;
}

export const FILTERS:Filter[] = [
  {
    id: 0,
    label: 'All'
  },
  {
    id: 1,
    label: 'My pools'
  }
]

export type Pool = {
  id: number;
  logo: string;
  name: string;
  prize: number;
  endDateTime: string;
  userParticipation: boolean;
}

const randomPastDate = ()=>subHours(new Date(), 25 + Math.round(Math.random() * 200)).toISOString();


const randomPool = (id: number):Pool=>{
  const names = ['Opensea'];
  return {
    id,
    logo: poolAvatar,
    name: names[0],
    prize: Number((3 + (Math.random() * 30)).toFixed(1)),
    endDateTime: randomPastDate(),
    userParticipation: Math.random() > 0.5,
  }
}

export const POOLS:Pool[] = [
  {
    id: 0,
    logo: poolAvatar,
    name: 'Opensea',
    prize: 5,
    endDateTime: addHours(new Date(), 20).toISOString(),
    userParticipation: false,
  },
]

for (let i = 0; i < 10; i++) {
  const pool = randomPool(i+1);
  POOLS.push(pool)
}

