import { atom } from 'recoil';

const PlayerAtom = atom<Tracker.Player | null>({
  key: 'player-atom',
  default: null
});

export default PlayerAtom;
