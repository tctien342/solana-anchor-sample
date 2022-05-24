import 'animate.css';
import '@styles/globals.scss';
import '@styles/override.scss';
import '@solana/wallet-adapter-react-ui/styles.css';

import { MainLayout } from '@layouts/MainLayout';
import { WalletLayout } from '@layouts/WalletLayout';
import { Web3Layout } from '@layouts/Web3Layout';
import { Logger } from '@saintno/needed-tools';
import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';

export const gLog = new Logger('App');

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
      <MainLayout>
        <Web3Layout>
          <WalletLayout>{getLayout(<PageContent {...pageProps} />)}</WalletLayout>
        </Web3Layout>
      </MainLayout>
    </RecoilRoot>
  );
}

export default MyApp;
