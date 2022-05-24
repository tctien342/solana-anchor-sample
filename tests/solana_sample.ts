import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import * as assert from 'assert';

import { SolanaSample } from '../target/types/solana_sample';

const { SystemProgram } = anchor.web3;

const utf8 = anchor.utils.bytes.utf8;

type TTodo = { title: String; content: String; done: boolean };

describe('solana_sample', async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.SolanaSample as Program<SolanaSample>;
  let [userPda] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('user'), provider.wallet.publicKey.toBuffer()],
    program.programId
  );
  const otherAccount = anchor.web3.Keypair.generate();

  anchor.setProvider(provider);
  console.log('CURRENT ADDRESS ==>', provider.wallet.publicKey.toString());

  const handleTodoEvent = (ev: { owner: PublicKey; todos: TTodo[] }) =>
    console.log('UpdateTodoEvent ==> ', { address: ev.owner.toString(), todos: ev.todos });
  const handleNameEvent = (ev: { owner: PublicKey; name: string }) =>
    console.log('UpdateNameEvent ==> ', { address: ev.owner.toString(), name: ev.name });

  const noteListener = program.addEventListener('UpdateTodoEvent', handleTodoEvent);
  const nameListener = program.addEventListener('UpdateNameEvent', handleNameEvent);

  it('Is created!', async () => {
    const name = 'EzGame';
    await program.methods
      .create(name)
      .accounts({
        storage: userPda,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.user.fetch(userPda);
    console.log('Default name: ', account.name.toString());
    assert.ok(account.name.toString() === name);
  });

  it('Update user name', async () => {
    const newName = 'EzGame Updated!';
    await program.methods.updateName(newName).accounts({ storage: userPda }).rpc();

    const account = await program.account.user.fetch(userPda);
    assert.ok(account.name.toString() === newName);
  });

  it('Add first note!', async () => {
    const title = 'Working hard';
    const content = 'Work hard, work smart, play more fuck hard';
    await program.methods.addTodo(title, content).accounts({ storage: userPda }).rpc();

    const account = await program.account.user.fetch(userPda);
    const todos: TTodo[] = account.todos as any;
    assert.ok(todos.length === 1);
    assert.ok(todos[0].title === title);
    assert.ok(todos[0].content === content);
  });

  it('Update first note title', async () => {
    const updateIndex = new anchor.BN(0);
    const newTitle = 'Updated note 1';
    await program.methods
      .updateTodoTitle(updateIndex, newTitle)
      .accounts({ storage: userPda })
      .rpc();

    const account = await program.account.user.fetch(userPda);
    const todos: TTodo[] = account.todos as any;
    assert.ok(todos.length > 0);
    assert.ok(todos[0].title === newTitle);
  });

  it('Update first note content', async () => {
    const updateIndex = new anchor.BN(0);
    const newContent = 'Content have been changed';
    await program.methods
      .updateTodoContent(updateIndex, newContent)
      .accounts({ storage: userPda })
      .rpc();

    const account = await program.account.user.fetch(userPda);
    const todos: TTodo[] = account.todos as any;
    assert.ok(todos.length > 0);
    assert.ok(todos[0].content === newContent);
  });

  it('Mark first note as done', async () => {
    const updateIndex = new anchor.BN(0);
    await program.methods.updateTodoStatus(updateIndex, true).accounts({ storage: userPda }).rpc();

    const account = await program.account.user.fetch(userPda);
    const todos: TTodo[] = account.todos as any;
    assert.ok(todos.length > 0);
    assert.ok(todos[0].done === true);
  });

  it('Should not change other account', async () => {
    const updateIndex = new anchor.BN(0);
    try {
      await program.methods
        .removeTodo(updateIndex)
        .accounts({ storage: userPda })
        .signers([otherAccount])
        .rpc();

      assert.fail('This should not happen');
    } catch (e) {
      assert.ok("Can't remove");
    }
  });

  it('Remove first note!', async () => {
    const updateIndex = new anchor.BN(0);
    await program.methods.removeTodo(updateIndex).accounts({ storage: userPda }).rpc();

    const account = await program.account.user.fetch(userPda);
    const todos: TTodo[] = account.todos as any;
    assert.ok(todos.length === 0);
  });

  it('Removed all listener', async () => {
    // Unbind listener
    program.removeEventListener(noteListener);
    program.removeEventListener(nameListener);
  });
});
