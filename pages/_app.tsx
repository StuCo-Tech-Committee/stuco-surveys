import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Header from '../components/header';
import NextNProgress from '../components/progressBar';
import { PusherProvider } from '@harelpls/use-pusher';
import Footer from '../components/footer';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <PusherProvider
      {...{
        clientKey: '3800fa093dc2b07f5524',
        cluster: 'us2',
      }}
    >
      <NextNProgress color="#9A1D2E" options={{ showSpinner: false }} />
      <AnimatePresence>
        {pageProps.hasOwnProperty('header') && pageProps.header === false ? (
          <></>
        ) : (
          <Header key="Header" />
        )}
      </AnimatePresence>
      <AnimatePresence exitBeforeEnter>
        <motion.div key={router.pathname}>
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
      {pageProps.hasOwnProperty('header') && pageProps.header === false ? (
        <></>
      ) : (
        <Footer />
      )}
    </PusherProvider>
  );
}

export default MyApp;
