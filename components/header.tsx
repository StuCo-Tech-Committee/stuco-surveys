import { motion } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { BiLoaderAlt } from 'react-icons/bi';
import Image from 'next/image';

const NavItem = ({ name, href }: { name: string; href: string }) => {
  return (
    <li className="flex flex-col justify-center">
      <Link href={href}>
        <a className="text-md ml-4 text-gray-800">{name}</a>
      </Link>
    </li>
  );
};

const Header = () => {
  const { data: session } = useSession();
  const [working, setWorking] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-row justify-between px-4 py-4 md:px-32"
    >
      <Link href="/">
        <a className="flex flex-row items-center gap-2 text-xl font-bold text-exeter">
          <Image
            alt="StuCo Surveys Logo"
            src="/stuco-surveys-icon.svg"
            width={28}
            height={28}
          />
          StuCo Surveys
        </a>
      </Link>
      <ul className="flex flex-row gap-4">
        <NavItem name="Manager" href="/manager" />
        <button
          onClick={() => {
            if (session) {
              setWorking(true);
              signOut();
            } else {
              setWorking(true);
              signIn('azure-ad');
            }
          }}
          className="font-bold"
        >
          {working ? (
            <BiLoaderAlt className="animate-spin" />
          ) : (
            session?.user?.name ?? 'Sign in'
          )}
        </button>
        {/* <NavItem name="Viewer" href="/viewer" /> */}
        {/* <NavItem name="Privacy" href="/privacy" /> */}
      </ul>
    </motion.div>
  );
};

export default Header;
