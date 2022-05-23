import { useUserTodo } from '@hooks/useUserTodo';
import { WalletLayout } from '@layouts/walletLayout';
import { useWallet } from '@solana/wallet-adapter-react';
import { userNameAtom } from '@states/app';
import { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

const DefaultPage: IPageComponent = () => {
  const { disconnect } = useWallet();
  const name = useRecoilValue(userNameAtom);
  const { todos, getUserData, createTodo, changeTodoStatus } = useUserTodo();
  const titleRef = useRef('');
  const contentRef = useRef('');

  console.log(todos);

  const handleLogout = () => {
    void disconnect();
  };

  const handlePressCreate = () => {
    createTodo(titleRef.current, contentRef.current);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="h-screen bg-white text-zinc-700 flex pr-28 pl-28 flex-col relative pt-24 pb-12">
      <div className="absolute top-2 right-2 flex flex-col items-end">
        <span className="text-xl font-thin">
          Wellcome <span className="font-bold">{name}</span>
        </span>
        <span
          onClick={handleLogout}
          className="text-sm cursor-pointer hover:text-blue-500 active:scale-90">
          LOGOUT
        </span>
      </div>
      <div className="font-bold">NEW TODO</div>
      <div className="flex w-100 flex-col p-1">
        <label>Title</label>
        <input
          onChange={(ev) => (titleRef.current = ev.target.value)}
          className="focus:outline-none"
          placeholder="Your todo title..."
        />
        <label>Content</label>
        <textarea
          onChange={(ev) => (contentRef.current = ev.target.value)}
          className="focus:outline-none"
          placeholder="Your todo content..."
        />
        <button
          onClick={handlePressCreate}
          className="bg-white border w-32 py-2 rounded-md text-zinc-700 self-end mt-3 text-sm font-bold hover:bg-neutral-500 hover:text-white active:scale-90">
          ADD
        </button>
      </div>
      <div className="font-bold">TODO LIST</div>
      <div className="flex flex-col mt-3">
        {todos.map((todo, idx) => (
          <div
            key={idx}
            style={{ opacity: todo.done ? 0.6 : 1 }}
            className="flex flex-row hover:shadow p-2 rounded-xl pr-4">
            <span className="flex justify-center items-center px-3 pr-4 text-4xl font-bold">
              {idx}
            </span>
            <div className="flex flex-col">
              <span
                className="text-md font-bold"
                style={{ textDecoration: todo.done ? 'line-through' : undefined }}>
                {todo.title}
              </span>
              <span>{todo.content}</span>
            </div>
            <div className="flex-auto" />
            <button
              onClick={() => changeTodoStatus(idx, !todo.done)}
              className="h-full flex justify-center items-center hover:text-green-400 active:scale-90">
              {todo.done ? 'MARK TODO' : 'MARK DONE'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

DefaultPage.getLayout = (children) => <WalletLayout>{children}</WalletLayout>;

export default DefaultPage;
