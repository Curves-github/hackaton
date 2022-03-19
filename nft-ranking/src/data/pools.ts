import {  addHours, subHours } from 'date-fns'
import poolAvatar from '../assets/pool-avatars/paras.png';
import poolPreview from '../assets/pool-previews/opensea.png';

export type Pool = {
  id: number;
  logo: string;
  preview: string;
  link: string,
  owner: string;
  name: string;
  description: string;
  prize: number;
  endDateTime: string;
  userParticipation: boolean;
}

const randomPastDate = ()=>subHours(new Date(), 25 + Math.round(Math.random() * 200)).toISOString();


const owners = ['Opensea'];
const randomPool = (id: number):Pool=>{
  return {
    id,
    logo: poolAvatar,
    preview: poolPreview,
    link: 'https://paras.id/',
    owner: owners[0],
    description: "Nostrud eiusmod officia incididunt aute. Incididunt ex aliqua irure cillum sunt duis proident velit. Anim et deserunt consectetur eu. Eiusmod nulla duis nulla nulla ipsum amet.",
    name: 'Future art',
    prize: Number((3 + (Math.random() * 30)).toFixed(1)),
    endDateTime: randomPastDate(),
    userParticipation: Math.random() > 0.5,
  }
}

export const POOLS:Pool[] = [
  {
    id: 0,
    logo: poolAvatar,
    preview: poolPreview,
    link: 'https://paras.id/',
    owner: owners[0],
    description: "Nostrud eiusmod officia incididunt aute. Incididunt ex aliqua irure cillum sunt duis proident velit. Anim et deserunt consectetur eu. Eiusmod nulla duis nulla nulla ipsum amet.",
    name: 'Pixel art of the day',
    prize: 5,
    endDateTime: addHours(new Date(), 20).toISOString(),
    userParticipation: false,
  },
]

for (let i = 0; i < 10; i++) {
  const pool = randomPool(i+1);
  POOLS.push(pool)
}
