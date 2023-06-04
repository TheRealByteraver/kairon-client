// import { TOKEN_API_URL } from "@/QueryFunctions/globals";

import Link from "next/link";

import ApiContainer from "@/Components/ApiContainer";
import { useQuery } from "@tanstack/react-query";

const HomePage: React.FC<{}> = ({}) => {
  const tokensQuery = useQuery({
    // cacheTime: 300 * 1000,
    refetchInterval: 1 * 1000, // for easy debugging
    // staleTime: 300 * 1000,
    // "queryKey" is always an array and should be unique across all queries
    queryKey: ["GET /token"],
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: () => {
      return (
        fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/token`)
          // .then((response) => response.text())
          .then((response) => response.json())
          // .then((body) => {
          //   console.log("own api response: ", body);
          //   return body;
          // })
          .then((response) => {
            if (response.error !== undefined) {
              console.log("response.error:", response.error);
              throw new Error(response.error);
            }
            return response;
          })
          .catch((error) => {
            throw new Error(error);
          })
      );
    },
  });

  const getTokens = () => {
    if (!(tokensQuery.isLoading || tokensQuery.isError)) {
      return tokensQuery.data
        .filter((token: OwnApiToken) => token.active)
        .map((token: OwnApiToken) => token.id);
    }
    return undefined;
  };

  const tokens = getTokens();

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
        {tokensQuery.isLoading && <p>Retrieving saved tokens...</p>}
        {tokensQuery.isError && (
          <p>{`An error occured retrieving saved tokens: ${JSON.stringify(
            tokensQuery.error
          )}`}</p>
        )}
        {tokens && <ApiContainer tokens={getTokens()} />}
      </div>
    </main>
  );
};

export default HomePage;
