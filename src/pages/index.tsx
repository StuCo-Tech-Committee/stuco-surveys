import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/header';
import { Hero } from '../components/common/Hero';

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
    </>
  );
};

export default Home;
