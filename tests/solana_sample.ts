import * as assert from 'assert';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';

import { SolanaSample } from '../target/types/solana_sample';

const { SystemProgram } = anchor.web3;

type TNote = { title: String; content: String; done: boolean };

describe('solana_sample', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.SolanaSample as Program<SolanaSample>;
  const baseAccount = anchor.web3.Keypair.generate();
  const name = 'EzGame';
  anchor.setProvider(provider);

  const handleNoteEvent = (ev) => console.log('UpdateNoteEvent ==> ', ev);
  const handleNameEvent = (ev) => console.log('UpdateNameEvent ==> ', ev);

  const noteListener = program.addEventListener('UpdateNoteEvent', handleNoteEvent);
  const nameListener = program.addEventListener('UpdateNameEvent', handleNameEvent);

  it('Is created!', async () => {
    const tx = await program.rpc.create('EzGame', {
      accounts: {
        data: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    console.log('Your transaction signature', tx);

    const account = await program.account.user.fetch(baseAccount.publicKey);
    console.log('Default name: ', account.name.toString());
    assert.ok(account.name.toString() === name);
  });

  it('Update user name', async () => {
    const newName = 'EzGame Updated!';
    const tx = await program.rpc.updateName(newName, {
      accounts: {
        data: baseAccount.publicKey,
      },
    });
    const account = await program.account.user.fetch(baseAccount.publicKey);
    assert.ok(account.name.toString() === newName);
  });

  it('Add first note!', async () => {
    const title = 'Working hard';
    const content = 'Work hard, work smart, play more fuck hard';
    await program.rpc.addNote(title, content, {
      accounts: {
        data: baseAccount.publicKey,
      },
    });
    const account = await program.account.user.fetch(baseAccount.publicKey);
    const notes: TNote[] = account.notes as any;
    assert.ok(notes.length === 1);
    assert.ok(notes[0].title === title);
    assert.ok(notes[0].content === content);
  });

  it('Update first note title', async () => {
    const updateIndex = new anchor.BN(0);
    const newTitle = 'Updated note 1';
    await program.rpc.updateNoteTitle(updateIndex, newTitle, {
      accounts: {
        data: baseAccount.publicKey,
      },
    });
    const account = await program.account.user.fetch(baseAccount.publicKey);
    const notes: TNote[] = account.notes as any;
    assert.ok(notes.length > 0);
    assert.ok(notes[0].title === newTitle);
  });

  it('Update first note content', async () => {
    const updateIndex = new anchor.BN(0);
    const newContent = 'Content have been changed';
    await program.rpc.updateNoteContent(updateIndex, newContent, {
      accounts: {
        data: baseAccount.publicKey,
      },
    });
    const account = await program.account.user.fetch(baseAccount.publicKey);
    const notes: TNote[] = account.notes as any;
    assert.ok(notes.length > 0);
    assert.ok(notes[0].content === newContent);
  });

  it('Mark first note as done', async () => {
    const updateIndex = new anchor.BN(0);
    await program.rpc.updateNoteStatus(updateIndex, true, {
      accounts: {
        data: baseAccount.publicKey,
      },
    });
    const account = await program.account.user.fetch(baseAccount.publicKey);
    const notes: TNote[] = account.notes as any;
    assert.ok(notes.length > 0);
    assert.ok(notes[0].done === true);
  });

  it('Remove first note!', async () => {
    const updateIndex = new anchor.BN(0);
    await program.rpc.removeNote(updateIndex, {
      accounts: {
        data: baseAccount.publicKey,
      },
    });
    const account = await program.account.user.fetch(baseAccount.publicKey);
    const notes: TNote[] = account.notes as any;
    assert.ok(notes.length === 0);
  });

  // it('Add 32 notes!', async () => {
  //   for (let i = 0; i < 32; i++) {
  //     const title = `Note ${i}`;
  //     const content = `Note ${i}`;
  //     await program.rpc.addNote(title, content, {
  //       accounts: {
  //         data: baseAccount.publicKey,
  //       },
  //     });
  //   }
  //   const account = await program.account.user.fetch(baseAccount.publicKey);
  //   const notes: TNote[] = account.notes as any;
  //   assert.ok(notes.length === 32);
  // });

  it('Removed all listener', async () => {
    // Unbind listener
    program.removeEventListener(noteListener);
    program.removeEventListener(nameListener);
  });
});
