import '@styles/globals.scss';

import { MainLayout } from '@layouts/mainLayout';
import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';

/**
 * Default layout for page component
 */
const DefaultLayout: IComponent = ({ children }) => <>{children}</>;

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout =
    (Component as IPageComponent).getLayout ||
    ((children) => <DefaultLayout>{children}</DefaultLayout>);

  const PageContent = Component as IPageComponent;

  return (
    <RecoilRoot>
      <MainLayout>{getLayout(<PageContent {...pageProps} />)}</MainLayout>
    </RecoilRoot>
  );
}

export default MyApp;
