import Link from 'next/link';

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
  return (
    <div className="absolute flex w-full flex-row justify-between px-4 py-4 md:px-32">
      <Link href="/">
        <a className="text-2xl font-bold text-exeter">StuCo Surveys</a>
      </Link>
      <ul className="flex flex-row">
        <NavItem name="Manager" href="/manager" />
        <NavItem name="Viewer" href="/viewer" />
        <NavItem name="Privacy" href="/privacy" />
      </ul>
    </div>
  );
};

export default Header;
