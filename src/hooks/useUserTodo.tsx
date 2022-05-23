import { BN, web3 } from '@project-serum/anchor';
import { userNameAtom, userTodoAtom } from '@states/app';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { useWorkspace } from './useWorkspace';

const { SystemProgram } = web3;

export const useUserTodo = () => {
  const { program, wallet, provider, userPda } = useWorkspace();
  const [todos, setTodos] = useRecoilState(userTodoAtom);
  const [userName, setUserName] = useRecoilState(userNameAtom);
  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    if (wallet && userPda) {
      try {
        const userData = await program!.account.user.fetch(userPda);
        setTodos(userData.notes as any);
        setUserName(userData.name);
        return userData;
      } catch (e) {
        return false;
      }
    } else return false;
  };

  const createUserAccount = async (name: string) => {
    if (!wallet || !userPda) return false;
    if ((await getUserData()) === false) {
      try {
        await program!.rpc.create(name, {
          accounts: {
            data: userPda,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
        });
        refreshUserTodo();
        setUserName(name);
        return true;
      } catch (e) {
        console.log('Cant create user', e);
        return false;
      }
    } else {
      console.log('User already exists');
      return false;
    }
  };

  const refreshUserTodo = () => {
    if (wallet && userPda) {
      setLoading(true);
      program!.account.user.fetch(userPda).then((data) => {
        setTodos(data.notes as any);
        setLoading(false);
      });
    }
  };

  const createTodo = async (title: string, content: string) => {
    if (wallet && userPda) {
      try {
        // const keypair = provider?.wallet.publicKey;
        const tx = await program!.rpc.addNote(title, content, {
          accounts: {
            data: userPda,
          },
        });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    } else return false;
  };

  const changeTodoStatus = async (id: number, status: boolean) => {
    if (wallet && userPda) {
      try {
        const tx = await program!.rpc.updateNoteStatus(new BN(id), status, {
          accounts: {
            data: userPda,
          },
        });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    } else return false;
  };

  return { todos, getUserData, createUserAccount, refreshUserTodo, createTodo, changeTodoStatus };
};
