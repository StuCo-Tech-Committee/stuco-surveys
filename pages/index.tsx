import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/header';

const Home: NextPage = () => {
  return (
    <div className="flex w-full flex-col">
      <Head>
        <title>StuCo Surveys</title>
        <meta
          name="description"
          content="Real-time survey system for Student Council."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="mx-4 flex h-screen flex-col justify-center self-stretch md:mx-32">
        <h1 className="text-6xl font-bold text-gray-900">
          Your voice matters to us.
        </h1>
        <h2 className="mt-6 text-3xl text-gray-700">
          Answer surveys and get rewarded.
        </h2>
      </div>
    </div>
  );
};

export default Home;
