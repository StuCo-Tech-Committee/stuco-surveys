import Link from 'next/link';
import { BsInstagram } from 'react-icons/bs';

const Footer = () => {
  return (
    <>
      <div className="flex w-full flex-row justify-between bg-gray-800 px-4 py-16 align-top md:px-32">
        <Link href="/">
          <a className="text-2xl font-bold text-white">StuCo Surveys</a>
        </Link>
        <div className="flex flex-row gap-8 pr-24">
          <div className="flex flex-col gap-2">
            <h1 className="font-monospace text-white">Platform</h1>
            <Link href="/privacy">
              <a className="text-gray-400">Privacy</a>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-between bg-gray-700 px-4 py-6 md:px-32">
        <h1 className="font-monospace text-sm text-gray-200">
          © {new Date().getFullYear()} Idk what to put here
        </h1>
        <div className="flex flex-row gap-2 text-2xl text-gray-400">
          <Link href="https://instagram.com">
            <a>
              <BsInstagram />
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
