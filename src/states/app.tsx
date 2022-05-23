import { atom } from 'recoil';

const darkStatusAtom = atom<boolean>({
  key: 'darkStatus',
  default: false,
});

const userNameAtom = atom<string>({
  key: 'userName',
  default: '',
});

const userTodoAtom = atom<TTodo[]>({
  key: 'userTodo',
  default: [],
});

export { darkStatusAtom, userNameAtom, userTodoAtom };
