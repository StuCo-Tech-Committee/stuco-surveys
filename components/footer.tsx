import Image from 'next/image';
import Link from 'next/link';
import { MdLockOutline, MdOutlineManageSearch } from 'react-icons/md';

const PlatformLink = ({
  name,
  href,
  icon,
}: {
  name: string;
  href: string;
  icon: any;
}) => {
  return (
    <Link
      href={href}
      className="flex flex-row items-center gap-1 text-gray-500 transition-colors hover:text-gray-700"
    >
      <>
        {icon}
        {name}
      </>
    </Link>
  );
};

const Footer = () => {
  return (
    <>
      <div className="flex w-full flex-row justify-between bg-gray-100 px-4 py-16 align-top md:px-32">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-2xl font-bold text-neutral-800">
            StuCo Surveys
          </Link>
          <Link
            href="https://vercel.com/stuco-tech-committee?utm_source=stuco-tech-committee&utm_campaign=oss"
            className="flex flex-row items-center gap-2"
          >
            <span>Powered by</span>
            <Image
              src="/images/vercel-logotype-dark.svg"
              alt="Vercel logo"
              width={90}
              height={20}
            />
          </Link>
        </div>
        <div className="flex flex-col justify-start gap-2">
          <h1 className="text-lg text-neutral-800">Platform</h1>
          <PlatformLink
            href="/manager"
            name="Manager"
            icon={<MdOutlineManageSearch className="text-xl" />}
          />
          <PlatformLink
            href="/privacy"
            name="Privacy"
            icon={<MdLockOutline className="text-xl" />}
          />
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-between bg-gray-200 px-4 py-6 md:px-32">
        <h1 className="font-monospace text-xs text-neutral-800">
          © {new Date().getFullYear()} StuCo Surveys
        </h1>
      </div>
    </>
  );
};

export default Footer;
