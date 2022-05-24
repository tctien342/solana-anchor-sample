import { AppConfig } from '@configs/app';
import idl from '@configs/contract.json';
import { AnchorProvider, Program, utils } from '@project-serum/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

import { SolanaSample } from '../types/contract';

const utf8 = utils.bytes.utf8;

const programID = new PublicKey(idl.metadata.address);

export const useWorkspace = () => {
  const wallet = useAnchorWallet();

  const [connection, setConnection] = useState<Connection>();
  const [provider, setProvider] = useState<AnchorProvider>();
  const [program, setProgram] = useState<Program<SolanaSample>>();
  const [userPda, setUserPda] = useState<PublicKey>();

  useEffect(() => {
    if (wallet && wallet.publicKey) {
      const conn = new Connection(AppConfig.Web3.provider, 'processed');
      const prov = new AnchorProvider(conn, wallet!, { preflightCommitment: 'processed' });
      const prog = new Program(idl as any, programID, prov) as Program<SolanaSample>;
      PublicKey.findProgramAddress(
        [utf8.encode('user'), prov.wallet.publicKey.toBuffer()],
        prog.programId
      ).then(([pda]) => setUserPda(pda));

      setConnection(conn);
      setProvider(prov);
      setProgram(prog);
    }
  }, [wallet]);

  return {
    wallet,
    connection,
    provider,
    program,
    userPda,
  };
};
