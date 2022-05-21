import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/header';
import { motion } from 'framer-motion';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>StuCo Surveys</title>
        <meta
          name="description"
          content="Real-time survey system for Student Council."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: {
            transition: {
              staggerChildren: 0.1,
            },
          },
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="mx-4 -mt-16 flex h-screen flex-col justify-center self-stretch md:mx-32"
      >
        <motion.h1
          variants={{
            hidden: {
              y: 20,
              opacity: 0,
            },
            visible: {
              y: 0,
              opacity: 1,
            },
          }}
          className="text-6xl font-bold text-gray-900"
        >
          Your voice matters to us.
        </motion.h1>
        <motion.h2
          variants={{
            hidden: {
              y: 20,
              opacity: 0,
            },
            visible: {
              y: 0,
              opacity: 1,
            },
          }}
          className="mt-6 text-3xl text-gray-700"
        >
          Answer surveys and get rewarded.
        </motion.h2>
      </motion.div>
    </div>
  );
};

export default Home;
