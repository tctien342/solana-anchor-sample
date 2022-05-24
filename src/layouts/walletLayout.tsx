import { CreateAccount } from '@components/CreateAccount';
import { useListenChainState } from '@hooks/useListenChainState';
import { useWorkspace } from '@hooks/useWorkspace';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

const WalletLayout: IComponent = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const { wallet, program } = useWorkspace();

  useListenChainState(program);

  useEffect(() => {
    if (wallet?.publicKey) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [program, wallet]);

  if (connected) {
    return (
      <div className="h-screen relative">
        <CreateAccount />
        {children}
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
