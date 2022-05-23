import { atom } from 'recoil';

const darkStatusAtom = atom<boolean>({
  key: 'darkStatus',
  default: false,
});

export { darkStatusAtom };
