import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import * as assert from 'assert';

import { SolanaSample } from '../target/types/solana_sample';

const { SystemProgram } = anchor.web3;

const utf8 = anchor.utils.bytes.utf8;

type TTodo = { title: String; content: String; done: boolean };

describe('solana_sample', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const program = anchor.workspace.SolanaSample as Program<SolanaSample>;
  anchor.setProvider(provider);

  console.log('CURRENT ADDRESS ==>', provider.wallet.publicKey.toString());

  const handleTodoEvent = (ev: { owner: PublicKey } & TTodo) =>
    console.log('UpdateTodoEvent ==> ', {
      address: ev.owner.toString(),
      todo: { title: ev.title, content: ev.content, done: ev.done },
    });
  const handleNameEvent = (ev: { owner: PublicKey; name: string }) =>
    console.log('UpdateNameEvent ==> ', { address: ev.owner.toString(), name: ev.name });

  const noteListener = program.addEventListener('UpdateTodoEvent', handleTodoEvent);
  const nameListener = program.addEventListener('UpdateNameEvent', handleNameEvent);

  let userPda: PublicKey;
  let selectedTodo: PublicKey;
  let otherAccount = Keypair.generate();

  // Add money for other account
  before(async () => {
    const { publicKey } = provider.wallet;
    const { publicKey: otherPublicKey } = otherAccount;
    const tx = new Transaction();
    tx.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: otherPublicKey,
        lamports: 1000000000,
      })
    );
    await provider.sendAndConfirm(tx);
  });

  it('Is created!', async () => {
    [userPda] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode('user'), provider.wallet.publicKey.toBuffer()],
      program.programId
    );
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

  it('Add first todo!', async () => {
    const title = 'Working hard';
    const content = 'Work hard, work smart, play more fuck hard';
    const keypair = Keypair.generate();
    await program.methods
      .addTodo(title, content)
      .accounts({
        storage: keypair.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    const todo = await program.account.todo.fetch(keypair.publicKey);
    assert.ok(todo.title === title);
    assert.ok(todo.content === content);
  });

  it('Add second todo!', async () => {
    const title = 'Working hard #2';
    const content = 'Work hard, work smart, play more fuck hard #2';
    const keypair = Keypair.generate();
    await program.methods
      .addTodo(title, content)
      .accounts({
        storage: keypair.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    const todo = await program.account.todo.fetch(keypair.publicKey);
    assert.ok(todo.title === title);
    assert.ok(todo.content === content);
  });

  it('Should get todo correctly', async () => {
    const allTodo = await program.account.todo.all([
      {
        memcmp: {
          offset: 8,
          bytes: provider.wallet.publicKey.toBase58(),
        },
      },
    ]);
    assert.ok(allTodo.length === 2);

    const otherTodos = await program.account.todo.all([
      {
        memcmp: {
          offset: 8,
          bytes: otherAccount.publicKey.toBase58(),
        },
      },
    ]);
    assert.ok(otherTodos.length === 0);

    selectedTodo = allTodo[0].publicKey;
  });

  it('Update todo', async () => {
    const newTitle = 'Updated todo 1';
    const newContent = 'Updated todo 1';
    await program.methods
      .updateTodo(newTitle, newContent)
      .accounts({ storage: selectedTodo, owner: provider.wallet.publicKey })
      .rpc();

    const todo = await program.account.todo.fetch(selectedTodo);
    assert.ok(todo.title === newTitle);
    assert.ok(todo.content === newContent);
  });

  it('Mark first todo as done', async () => {
    await program.methods
      .updateTodoStatus(true)
      .accounts({ storage: selectedTodo, owner: provider.wallet.publicKey })
      .rpc();

    const todo = await program.account.todo.fetch(selectedTodo);
    assert.ok(todo.done === true);
  });

  it('Should not change other account', async () => {
    try {
      await program.methods
        .removeTodo()
        .accounts({ storage: selectedTodo, owner: otherAccount.publicKey })
        .signers([otherAccount])
        .rpc();

      assert.fail('This should not happen');
    } catch (e) {
      assert.ok("Can't remove");
    }
  });

  it('Remove first todo!', async () => {
    await program.methods
      .removeTodo()
      .accounts({ storage: selectedTodo, owner: provider.wallet.publicKey })
      .rpc();

    try {
      const todo = await program.account.todo.fetch(selectedTodo);
      assert.fail('This account should be removed');
    } catch (e) {
      assert.ok('Account removed');
    }
  });

  it('Removed all listener', async () => {
    // Unbind listener
    program.removeEventListener(noteListener);
    program.removeEventListener(nameListener);
  });
});
