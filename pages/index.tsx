import Link from "next/link";

import ApiContainer from "@/Components/ApiContainer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TokenForm from "@/Components/TokenForm";
import readAllTokens from "@/ApiQueries/ownApi/readAllTokens";
import updateToken from "@/ApiQueries/ownApi/updateToken";
import createToken from "@/ApiQueries/ownApi/createToken";
import Header from "@/Components/Header";
import readCoinsMarkets from "@/ApiQueries/CoinGeckoApi/readCoinsMarkets";
import { useEffect, useState } from "react";
import parseCoinGeckoApiToken from "@/helpers/parseCoinGeckoApiToken";
import OverviewTable from "@/Components/OverviewTable";

const HomePage: React.FC<{}> = ({}) => {
  // console.log("rendering home page");

  const queryClient = useQueryClient();
  const tokensQuery = useQuery({
    // refetchInterval: 1 * 1000,
    // "queryKey" is always an array and should be unique across all queries
    queryKey: ["GET /token"],
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: async () => {      
      const response = await readAllTokens();
      // console.log('Running readAllTokens(), returned: ', response);
      return response;
    },
  });

  const getTokens = (): string[] | undefined => {
    if (
      tokensQuery.isLoading ||
      tokensQuery.isError ||
      "error" in tokensQuery.data
    ) {
      return undefined;
    }
    return tokensQuery.data
      .filter((token: OwnApiToken) => token.active)
      .map((token: OwnApiToken) => token.id);
  };

  // docs: https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses
  const addTokenMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      // console.log('now calling addTokenMutation s function for tokenId', tokenId);
      // check if the token is present in the list of archived
      // tokens and if so, simply reactivate it:
      if (tokensQuery.data && !("error" in tokensQuery.data)) {
        const filteredTokens = tokensQuery.data.filter((token: OwnApiToken) => tokenId === token.id);
        if (filteredTokens.length === 1) {

          // found token, need to reactivate it
          const response = await updateToken({ active: true, id: tokenId });
          return // tokensQuery.data;
        }
        // No, the token was not yet present, create it anew:
        // console.log('calling createToken from addTokenMutation with arg', tokenId);
        const response = await createToken(tokenId);
        // return tokensQuery.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["GET /token"]), 
      queryClient.invalidateQueries(["GET /coins/markets"]);
    },
  });

  const archiveTokenMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      // console.log('calling updateToken from archiveTokenMutation with arg', { active: false, id: tokenId });
      const response = await updateToken({ active: false, id: tokenId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["GET /token"]), 
      queryClient.invalidateQueries(["GET /coins/markets"]); 
    },
  });

  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------

  const coinsMarketsQuery = useQuery({
    // cacheTime: 300 * 1000,
    refetchInterval: 30 * 1000,
    // staleTime: 30 * 1000,
    // "queryKey" is always an array and should be unique across all queries
    queryKey: ["GET /coins/markets"],
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: () => {
      const tokens = getTokens();
      console.log("now running readCoinsMarkets() for tokens:", tokens);
      // if (tokens) {
      //   return readCoinsMarkets(tokens as string[]);
      // }
      return [];
    },
    enabled: tokensQuery.isSuccess,
  });

  // Get a list tokens
  const getApiTokens = () => {
    if (coinsMarketsQuery.isLoading) return "loading";
    if (coinsMarketsQuery.isError)
      return `error: ${JSON.stringify(coinsMarketsQuery.error)}`;
    return coinsMarketsQuery.data;
  };

  const getData = (): Token[] | null => {
    const apiTokens = getApiTokens();
    if (typeof apiTokens === "string") return null; // TODO (quick hack)
    return apiTokens.map((apiToken) => parseCoinGeckoApiToken(apiToken));
  };

  const data = getData();

  // -------------------------------------------------------------------------------

  const tokens = getTokens();

  const addToken = (token: string) => {
    addTokenMutation.mutate(token);
    queryClient.invalidateQueries(["GET /token"]);
  };
  const removeToken = (token: string) => {
    archiveTokenMutation.mutate(token);
    queryClient.invalidateQueries(["GET /token"]);
  };

  return (
    <main className="p-2">
      <Header />
      <TokenForm addToken={addToken} />

      <div className="mt-4">
        {tokensQuery.isLoading && <p>retrieving saved tokens...</p>}
        {tokensQuery.isError && (
          <p>{`An error occured retrieving saved tokens: ${JSON.stringify(
            tokensQuery.error
          )}`}</p>
        )}

        {tokens && (
          <ul>
            {(tokensQuery.data! as OwnApiToken[])
              .filter((token) => token.active)
              .map((token) => (
                <li key={token.id}>
                  <button onClick={() => removeToken(token.id)}>XXX</button>{" "}
                  {token.id}
                </li>
              ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default HomePage;
