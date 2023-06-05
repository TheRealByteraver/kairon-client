import Link from "next/link";

import ApiContainer from "@/Components/ApiContainer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TokenForm from "./TokenForm";
import tokensQueryFn from "@/QueryFunctions/tokensQueryFn";

const HomePage: React.FC<{}> = ({}) => {
  const queryClient = useQueryClient();
  const tokensQuery = useQuery({
    // cacheTime: 300 * 1000,
    refetchInterval: 1 * 1000, // for easy debugging
    // staleTime: 300 * 1000,
    // "queryKey" is always an array and should be unique across all queries
    queryKey: ["GET /token"],
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: tokensQueryFn,
  });

  const newTokenMutation = useMutation({
    mutationFn: async (token: string) =>
      fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: token }),
      })
        .then((response) => response.json())
        .then((body) => {
          console.log("own api response: ", body);
          return body;
        })
        .then((response) => {
          if (response.error !== undefined) {
            console.log("response.error:", response.error);
            throw new Error(response.error);
          }
          return response;
        })
        .catch((error) => {
          throw new Error(error);
        }),
    // automatically update the list with posts "on the screen"
    onSuccess: () => {
      queryClient.invalidateQueries(["GET /token"]);
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
  console.log('tokens:', tokens);

  return (
    <main>
      <header>
        <nav>
          <Link href="/archive">Archive</Link>
        </nav>
      </header>
      <hr className="mb-4" />

      <TokenForm
        addToken={
          (token: string) => newTokenMutation.mutate(token)
      }
      />

      <div className="p-2 mt-4">
        {tokensQuery.isLoading && <p>retrieving saved tokens...</p>}
        {tokensQuery.isError && (
          <p>{`An error occured retrieving saved tokens: ${JSON.stringify(
            tokensQuery.error
          )}`}</p>
        )}
        {tokens && <ApiContainer tokens={tokens} />}
      </div>
    </main>
  );
};

export default HomePage;
