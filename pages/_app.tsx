import { Inter, JetBrains_Mono } from '@next/font/google';
import { AnimatePresence } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Footer from '../components/footer';
import Header from '../components/header';
import NextNProgress from '../components/progressBar';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  return (
    <div className={`${jetBrainsMono.variable} ${inter.variable} font-sans`}>
      <SessionProvider session={session}>
        <NextNProgress color="#9A1D2E" options={{ showSpinner: false }} />
        <AnimatePresence>
          {pageProps.hasOwnProperty('header') && pageProps.header === false ? (
            <></>
          ) : (
            <Header key="Header" />
          )}
        </AnimatePresence>
        <Component key={router.pathname} {...pageProps} />
        {pageProps.hasOwnProperty('header') && pageProps.header === false ? (
          <></>
        ) : (
          <Footer />
        )}
      </SessionProvider>
    </div>
  );
}

export default MyApp;
