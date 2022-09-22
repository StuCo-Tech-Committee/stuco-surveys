import { PusherProvider } from '@harelpls/use-pusher';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Footer from '../components/footer';
import Header from '../components/header';
import NextNProgress from '../components/progressBar';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <PusherProvider
        {...{
          clientKey: '3800fa093dc2b07f5524',
          cluster: 'us2',
        }}
      >
        <SessionProvider session={session}>
          <NextNProgress color="#9A1D2E" options={{ showSpinner: false }} />
          <AnimatePresence>
            {pageProps.hasOwnProperty('header') &&
            pageProps.header === false ? (
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
    </QueryClientProvider>
  );
}

export default MyApp;
