import { Hero } from '@/components/common/Hero';
import Features from '@/components/common/Features';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>StuCo Surveys</title>
        <meta
          name="description"
          content="Real-time survey system for Student Council."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <Features />
    </>
  );
};

export default Home;
