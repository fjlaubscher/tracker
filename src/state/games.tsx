import { atom } from 'recoil';

const GamesAtom = atom<Tracker.Game[] | null>({
  key: 'games-atom',
  default: null
});

export default GamesAtom;