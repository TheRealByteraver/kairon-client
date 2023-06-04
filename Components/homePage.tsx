import Link from "next/link";

import ApiContainer from "@/Components/ApiContainer";

const HomePage: React.FC<{}> = ({}) => {
  return (
    <main>
      <header>
        <nav>
          <Link href="/archive">Archive</Link>
        </nav>
      </header>
      <form>
        <label>
          Token ID
          <input
            type="text"
            className="mx-2 border-2 border-black rounded-lg"
          />
        </label>
        <button type="submit">ADD</button>
      </form>

      <div className="p-2 mt-4">
        <ApiContainer />
      </div>
    </main>
  );
};

export default HomePage;
