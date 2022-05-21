import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Header from '../components/header';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <AnimatePresence>
        {pageProps.hasOwnProperty('header') && pageProps.header == false ? (
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
    </>
  );
}

export default MyApp;
