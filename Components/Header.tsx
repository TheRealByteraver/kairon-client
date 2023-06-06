import Link from "next/link";
import { useRouter } from "next/router";

const Header: React.FC<{}> = ({}) => {
  const router = useRouter();

  return (
    <>
      <header>
        <nav>
          <ul className="h-16 flex flex-row justify-start items-center text-xl">
            <li
              className={`mr-4 border-black ${router.pathname === "/" ? "border-b-2" : ""}`}
            >
              <Link href="/">Home</Link>
            </li>
            <li
              className={`mr-4 border-black ${
                router.pathname === "/archive" ? "border-b-2" : ""
              }`}
            >
              <Link href="/archive">Archive</Link>
            </li>


            <li
              className={`mr-4 border-black ${
                router.pathname === "/bitcoin" ? "border-b-2" : ""
              }`}
            >
              <Link href="/bitcoin">Bitcoin</Link>
            </li>





          </ul>
        </nav>
      </header>
      <hr className="mb-4" />
    </>
  );
};

export default Header;
