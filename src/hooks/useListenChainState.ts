import { Program } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { userNameAtom, userTodoAtom } from '@states/app';
import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { SolanaSample } from 'src/types/contract';

const useListenChainState = (program?: Program<SolanaSample>) => {
  const wallet = useWallet();
  const nameListenerRef = useRef<number | null>();
  const todoListenerRef = useRef<number | null>();
  const setUserName = useSetRecoilState(userNameAtom);
  const setUserTodo = useSetRecoilState(userTodoAtom);

  useEffect(() => {
    if (program && wallet.publicKey) {
      nameListenerRef.current = program.addEventListener(
        'UpdateNameEvent',
        (ev: { owner: PublicKey; name: string }) => {
          if (ev.owner.equals(wallet.publicKey!)) {
            setUserName(ev.name);
          }
        }
      );
      todoListenerRef.current = program.addEventListener(
        'UpdateNoteEvent',
        (ev: { owner: PublicKey; todos: TTodo[] }) => {
          if (ev.owner.equals(wallet.publicKey!)) {
            setUserTodo(ev.todos);
          }
        }
      );
    }
    return () => {
      if (program && wallet.publicKey) {
        if (nameListenerRef.current) {
          program.removeEventListener(nameListenerRef.current);
        }
        if (todoListenerRef.current) {
          program.removeEventListener(todoListenerRef.current);
        }
      }
    };
  }, [program, setUserName, setUserTodo, wallet]);
};

export { useListenChainState };
