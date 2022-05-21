import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/header';

const Privacy: NextPage = () => {
  return (
    <div className="flex w-full flex-col">
      <Head>
        <title>StuCo Surveys - Privacy</title>
        <meta
          name="description"
          content="Real-time survey system for Student Council."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-4 flex h-[80vh] flex-col justify-center self-stretch md:mx-32">
        <h1 className="text-6xl font-bold text-gray-900">
          Privacy is a universal human right.
        </h1>
        <h2 className="mt-6 text-3xl text-gray-700">
          We take multiple steps to uphold the modern standards of privacy,
          integrity, and security.
        </h2>
      </div>
      <div className="mx-4 flex flex-col items-center justify-start bg-gray-100 p-32 md:mx-32">
        <h1 className="text-6xl font-semibold text-gray-700">How it works</h1>
        <div className="mt-14">
          <div className="my-16 flex flex-row items-center justify-start">
            <p className="text-5xl font-black text-gray-600">1</p>
            <p className="ml-16 text-3xl text-gray-500">
              Submit your survey.<br></br>
              <span className="text-2xl text-gray-400">
                Submissions are sent securely over SSL, meaning no outside
                attacker can view or modify your answers. You may rest assured
                the integrity of your voice is maintained.
              </span>
            </p>
          </div>
          <div className="my-16 flex flex-row items-center justify-start">
            <p className="text-5xl font-black text-gray-600">2</p>
            <p className="ml-16 text-3xl text-gray-500">
              Answers and identification become decoupled.<br></br>
              <span className="text-2xl text-gray-400">
                After submission, your survey response and all personally
                identifiable information are split, obfuscated, and sent to two
                separate databases, making it impossible for your response to be
                traced back to you.
              </span>
              <span className="text-2xl italic text-gray-500">
                {' '}
                We only store your personal information to contact you when you
                win a survey raffle.
              </span>
            </p>
          </div>
          <div className="my-16 flex flex-row items-center justify-start">
            <p className="text-5xl font-black text-gray-600">3</p>
            <p className="ml-16 text-3xl text-gray-500">
              Database entries are encrypted.<br></br>
              <span className="text-2xl text-gray-400">
                Once your submission and information are moved to our database,
                all data becomes encrypted, granting only authorized personnel
                permission to view and manage the data.
              </span>
            </p>
          </div>
          <div className="my-16 flex flex-row items-center justify-start">
            <p className="text-5xl font-black text-gray-600">4</p>
            <p className="ml-16 text-3xl text-gray-500">
              Overview of data is sent to StuCo.<br></br>
              <span className="text-2xl text-gray-400">
                StuCo may use submission data to assist decision makers during
                meetings by viewing an accurate representation of opinions held
                by the larger student body in real time. StuCo only uses
                generalized statistics during analysis by the whole council.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
