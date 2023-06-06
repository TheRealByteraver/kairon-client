import Link from "next/link";

const Header: React.FC<{}> = ({}) => {
  return (
    <>
      <header>
        <nav>
          <ul className="h-16 flex flex-row justify-start items-center text-xl">
            <li className="mr-4"><Link href="/">Home</Link></li>
            <li className="mr-4"><Link href="/archive">Archive</Link></li>
          </ul>
        </nav>
      </header>
      <hr className="mb-4" />
    </>
  );
};

export default Header;
