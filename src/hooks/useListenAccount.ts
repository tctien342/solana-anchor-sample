import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useEffect, useRef } from 'react';

export const useListenAccount = (cb: () => void, timePoll = 500) => {
  const wallet = useAnchorWallet();
  const currentKey = useRef(wallet?.publicKey.toBase58());

  const handleChecker = () => {
    if (currentKey.current !== wallet?.publicKey.toBase58()) {
      currentKey.current = wallet?.publicKey.toBase58();
      cb();
    }
  };

  useEffect(() => {
    let checker = setInterval(handleChecker, timePoll);
    return () => clearInterval(checker);
  }, []);
};
