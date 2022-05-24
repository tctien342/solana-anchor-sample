import { gLog } from '@pages/_app';
import { BN } from '@project-serum/anchor';
import { SystemProgram } from '@solana/web3.js';
import { userNameAtom, userTodoAtom } from '@states/app';
import { useState } from 'react';
import { useRecoilState } from 'recoil';

import { useWorkspace } from './useWorkspace';

export const useTodoSmartContract = () => {
  const { program, wallet, userPda } = useWorkspace();
  const [, setTodos] = useRecoilState(userTodoAtom);
  const [, setUserName] = useRecoilState(userNameAtom);
  const [loading, setLoading] = useState(false);

  const reloadUserData = async () => {
    if (userPda) {
      setLoading(true);
      try {
        const data = await program?.account.user.fetch(userPda);
        if (data) {
          setUserName(data.name);
          setTodos(data.todos as TTodo[]);
          gLog.i('reloadUserData', 'Request data success', data);
          return true;
        }
      } catch (e) {
        gLog.w('reloadUserData', 'Cant get user data', e);
      }
      setLoading(false);
    }
    return false;
  };

  const createAccount = async (name: string) => {
    if (userPda && wallet) {
      try {
        await program?.methods
          .create(name)
          .accounts({
            storage: userPda,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        gLog.i('createAccount', 'Account created');
        return true;
      } catch (e) {
        gLog.w('createAccount', 'Cant create account', e);
        return false;
      }
    }
  };

  const changeName = async (name: string) => {
    if (userPda && wallet) {
      try {
        await program?.methods
          .updateName(name)
          .accounts({
            storage: userPda,
          })
          .rpc();
        gLog.i('changeName', 'Success change name');
        return true;
      } catch (e) {
        gLog.w('changeName', 'Cant change name', e);
        return false;
      }
    }
  };

  const addTodo = async (title: string, content: string) => {
    if (userPda && wallet) {
      try {
        await program?.methods
          .addTodo(title, content)
          .accounts({
            storage: userPda,
          })
          .rpc();
        gLog.i('addTodo', 'Success add new todo');
        return true;
      } catch (e) {
        gLog.w('addTodo', 'Cant add todo', e);
        return false;
      }
    }
  };

  const updateTodo = async (id: number, title: string, content: string) => {
    if (userPda && wallet) {
      try {
        await program?.methods
          .updateTodo(new BN(id), title, content)
          .accounts({
            storage: userPda,
          })
          .rpc();
        gLog.i('updateTodo', 'Success update todo: ', id);
        return true;
      } catch (e) {
        gLog.w('updateTodo', 'Cant update todo', e);
        return false;
      }
    }
  };

  const changeTodoStatus = async (id: number, status: boolean) => {
    if (userPda && wallet) {
      try {
        await program?.methods
          .updateTodoStatus(new BN(id), status)
          .accounts({
            storage: userPda,
          })
          .rpc();
        gLog.i('changeTodoStatus', 'Success update todo status: ', id);
        return true;
      } catch (e) {
        gLog.w('changeTodoStatus', 'Cant update todo status', e);
        return false;
      }
    }
  };

  const removeTodo = async (id: number) => {
    if (userPda && wallet) {
      try {
        await program?.methods
          .removeTodo(new BN(id))
          .accounts({
            storage: userPda,
          })
          .rpc();
        gLog.i('removeTodo', 'Success remove todo: ', id);
        return true;
      } catch (e) {
        gLog.w('removeTodo', 'Cant remove todo', e);
        return false;
      }
    }
  };

  return {
    loading,
    reloadUserData,
    createAccount,
    changeName,
    addTodo,
    updateTodo,
    changeTodoStatus,
    removeTodo,
  };
};
