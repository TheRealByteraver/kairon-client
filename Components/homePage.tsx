import Link from "next/link";

import ApiContainer from "@/Components/ApiContainer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TokenForm from "./TokenForm";
import tokensQueryFn from "@/QueryFunctions/tokensQueryFn";

const HomePage: React.FC<{}> = ({}) => {
  const queryClient = useQueryClient();
  const tokensQuery = useQuery({
    refetchInterval: 1 * 1000,
    // "queryKey" is always an array and should be unique across all queries
    queryKey: ["GET /token"],
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: tokensQueryFn,
  });

  const addTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      // check if the token is present in the list of archived tokens
      // if so, simply reactivate it
      if (tokensQuery.data) {
        let foundToken = false;
        const newTokenData = tokensQuery.data.map((t: OwnApiToken) => {
          if (t.id === token) {
            foundToken = true;
            return { id: t.id, active: true }
          }
          return t;
        });

        if (foundToken) {

          // https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses

        // TODO:
        //   queryClient.setQueryData(
        //     ["GET /token"],
        //     (oldTokenList: OwnApiToken[] | undefined): OwnApiToken[] => {
        //       let newTokenList: OwnApiToken[];
        //       if (oldTokenList) {
        //         newTokenList = [...oldTokenList, response];
        //       } else {
        //         newTokenList = [response];
        //       }
        //       return newTokenList;
        //     }
        //   );
        //   return tokensQuery.data;
        }

        // UPDATE API HERE WITH fetch 'PUT' !
      }

      return (
        fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: token }),
        })
          .then((response) => response.json())
          // .then((response) => {
          //   console.log("own api response: ", response);
          //   return response;
          // })
          .then((response) => {
            if (response.error !== undefined) {
              console.log("response.error:", response.error);
              throw new Error(response.error);
            }
            // add the new token directly to our list of tokens in the Query
            // cache, no refetching or invalidating necessary:
            queryClient.setQueryData(
              ["GET /token"],
              (oldTokenList: OwnApiToken[] | undefined): OwnApiToken[] => {
                let newTokenList: OwnApiToken[];
                if (oldTokenList) {
                  newTokenList = [...oldTokenList, response];
                } else {
                  newTokenList = [response];
                }
                return newTokenList;
              }
            );
            return response;
          })
          .catch((error) => {
            throw new Error(error);
          })
      );
    },
  });

  const archiveTokenMutation = useMutation({
    mutationFn: async (token: string) =>
      fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/token/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: token, active: 0 }),
      })
        .then((response) => response.json())
        // .then((response) => {
        //   console.log("own api response: ", response);
        //   return response;
        // })
        .then((response) => {
          if (response.error !== undefined) {
            console.log("response.error:", response.error);
            throw new Error(response.error);
          }
          // add the new token directly to our list of tokens in the Query
          // cache, no refetching or invalidating necessary:
          queryClient.setQueryData(
            ["GET /token"],
            (oldTokenList: OwnApiToken[] | undefined): OwnApiToken[] => {
              let newTokenList: OwnApiToken[];
              if (oldTokenList) {
                newTokenList = oldTokenList.filter(
                  (token: OwnApiToken) => token.id !== response.id
                );
              } else {
                newTokenList = [response];
              }
              return newTokenList;
            }
          );
          return response;
        })
        .catch((error) => {
          throw new Error(error);
        }),
  });

  const getTokens = (): string[] | undefined => {
    if (tokensQuery.isLoading || tokensQuery.isError) {
      return undefined;
    }
    return tokensQuery.data
      .filter((token: OwnApiToken) => token.active)
      .map((token: OwnApiToken) => token.id);
  };

  const tokens = getTokens();
  console.log("tokens @ homePage:", tokens);

  return (
    <main>
      <header>
        <nav>
          <Link href="/archive">Archive</Link>
        </nav>
      </header>
      <hr className="mb-4" />

      <TokenForm addToken={(token: string) => addTokenMutation.mutate(token)} />

      <div className="p-2 mt-4">
        {tokensQuery.isLoading && <p>retrieving saved tokens...</p>}
        {tokensQuery.isError && (
          <p>{`An error occured retrieving saved tokens: ${JSON.stringify(
            tokensQuery.error
          )}`}</p>
        )}
        {tokens && (
          <ApiContainer
            tokens={tokens}
            removeToken={(token: string) => archiveTokenMutation.mutate(token)}
          />
        )}
      </div>
    </main>
  );
};

export default HomePage;
