import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

const NavItem = ({ name, href }: { name: string; href: string }) => {
  return (
    <li className="flex flex-col justify-center">
      <Link href={href} className="text-md text-gray-800">
        {name}
      </Link>
    </li>
  );
};

const Header = () => {
  const { data: session } = useSession();
  const [working, setWorking] = useState(false);

  return (
    <div className="flex w-full flex-row justify-between px-4 py-4 md:px-32">
      <div className="flex items-center font-bold">
        <Link
          href="/"
          className="flex flex-row items-center gap-2 text-xl text-exeter"
        >
          <Image
            alt="StuCo Surveys Logo"
            src="/stuco-surveys-icon.svg"
            width={28}
            height={28}
          />
          StuCo Surveys
        </Link>
      </div>

      <ul className="flex flex-row gap-4">
        <NavItem name="Manager" href="/manager" />
        <NavItem name="Privacy" href="/privacy" />
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
      </ul>
    </div>
  );
};

export default Header;
