import { useUserTodo } from '@hooks/useUserTodo';
import { useWorkspace } from '@hooks/useWorkspace';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { userNameAtom, userTodoAtom } from '@states/app';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

const WalletLayout: IComponent = ({ children }) => {
  const [userName, setUserName] = useRecoilState(userNameAtom);
  const setUserTodo = useSetRecoilState(userTodoAtom);
  const [connected, setConnected] = useState(false);
  const { wallet, program } = useWorkspace();
  const { getUserData, createUserAccount } = useUserTodo();
  const nameListenerRef = useRef<number | null>();
  const todoListenerRef = useRef<number | null>();
  const nameRef = useRef('');

  const handleCreateAccount = () => {
    if (nameRef.current.length > 0) {
      createUserAccount(nameRef.current);
    }
  };

  /**
   * Checking if wallet is connected and bind program listener
   */
  useEffect(() => {
    if (wallet?.publicKey && program) {
      void getUserData();
      setConnected(true);
      nameListenerRef.current = program.addEventListener(
        'UpdateNameEvent',
        (ev: { name: string }) => setUserName(ev.name)
      );
      todoListenerRef.current = program.addEventListener(
        'UpdateNoteEvent',
        (ev: { notes: TTodo[] }) => setUserTodo(ev.notes)
      );
    } else {
      setConnected(false);
    }

    return () => {
      if (program && todoListenerRef.current && nameListenerRef.current) {
        program.removeEventListener(nameListenerRef.current!);
        program.removeEventListener(todoListenerRef.current!);
      }
    };
  }, [wallet, program]);

  if (connected && userName) {
    return <>{children}</>;
  }

  if (connected) {
    return (
      <div className="h-screen flex justify-center items-center flex-col">
        <h3 className="mt-12 text-2xl text-zinc-700">
          WELCOME TO <span className="font-bold">TODOCHAIN</span>
        </h3>
        <h3 className="mb-12 text-xl text-zinc-700 font-thin">Create your todo account</h3>
        <div className="flex flex-col w-96 mb-48">
          <label>USER NAME</label>
          <input
            onChange={(ev) => (nameRef.current = ev.target.value)}
            className="w-full h-12 pv-3 focus:outline-none"
            placeholder="Your username..."
          />
          <button
            onClick={handleCreateAccount}
            className="self-end text-sm hover:text-blue-500 active:scale-90">
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white text-zinc-700 font-thin text-green flex justify-center items-center flex-col">
      <span className="text-6xl">TODOCHAIN</span>
      <span className="mb-8">
        Connect your <span className="font-bold">Wallet</span>
      </span>
      <WalletMultiButton />
      <span className="mt-12 text-xs font-thin">
        Power by <span className="font-bold text-purple-800">Solana</span>
      </span>
    </div>
  );
};

export { WalletLayout };
