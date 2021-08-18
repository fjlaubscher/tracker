import { atom } from 'recoil';

const GameAtom = atom<Tracker.Game | null>({
  key: 'game-atom',
  default: null
});

export default GameAtom;