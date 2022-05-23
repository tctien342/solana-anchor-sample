import { darkStatusAtom } from '@states/app';
import { cx } from '@utils/common';
import { useRecoilValue } from 'recoil';

export const MainLayout: IComponent = ({ children }) => {
  const darkStatus = useRecoilValue(darkStatusAtom);

  return (
    <div
      className={cx({
        dark: darkStatus,
      })}>
      {children}
    </div>
  );
};
