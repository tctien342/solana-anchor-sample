import { darkStatusAtom } from '@states/app';
import { cx } from '@utils/common';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import { TransitionLayout } from './TransitionLayout';

export const MainLayout: IComponent = ({ children }) => {
  const darkStatus = useRecoilValue(darkStatusAtom);
  const router = useRouter();

  return (
    <div
      className={cx({
        dark: darkStatus,
      })}>
      <TransitionLayout location={router.pathname}>{children}</TransitionLayout>
    </div>
  );
};
