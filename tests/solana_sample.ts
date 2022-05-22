import * as assert from 'assert';
import * as anchor from '@project-serum/anchor';

const { SystemProgram } = anchor.web3;

describe('solana_sample', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.SolanaSample;
  const baseAccount = anchor.web3.Keypair.generate();
  anchor.setProvider(provider);

  it('Is created!', async () => {
    const tx = await program.rpc.create({
      accounts: {
        accountInfo: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    console.log('Your transaction signature', tx);

    const account = await program.account.userInfo.fetch(baseAccount.publicKey);
    console.log('Default Level: ', account.level.toString());
    assert.ok(account.level.toString() == 0);
  });

  it('Is levelUP!', async () => {
    await program.rpc.levelUp({
      accounts: {
        accountInfo: baseAccount.publicKey,
      },
    });
    const account = await program.account.userInfo.fetch(baseAccount.publicKey);
    assert.ok(account.level.toString() == 1);
  });
});
