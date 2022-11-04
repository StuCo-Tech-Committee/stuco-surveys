import { PusherProvider } from '@harelpls/use-pusher';
import { AnimatePresence, motion } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Footer from '../components/footer';
import Header from '../components/header';
import NextNProgress from '../components/progressBar';
import '../styles/globals.css';
import { Inter, JetBrains_Mono } from '@next/font/google';

const inter = Inter({
  subsets: ['latin'],
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  return (
    <PusherProvider
      {...{
        clientKey: '3800fa093dc2b07f5524',
        cluster: 'us2',
      }}
    >
      <SessionProvider session={session}>
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
      </SessionProvider>
    </PusherProvider>
  );
}

export default MyApp;
