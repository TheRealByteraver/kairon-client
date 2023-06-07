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
    queryFn: readAllTokens,
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
    // Supposedly we should set the Query Data (react-query's internal cache)
    // in an onSuccess() function rather than in the mutationFn directly but
    // the below approach is more feasible as we need different api functions
    // here (we need to either un-archive the token or create it):
    mutationFn: async (tokenId: string) => {
      // check if the token is present in the list of archived
      // tokens and if so, simply reactivate it:
      if (tokensQuery.data && !("error" in tokensQuery.data)) {
        let foundToken = false;
        const newTokenData = tokensQuery.data.map((token: OwnApiToken) => {
          if (token.id === tokenId) {
            foundToken = true;
            return { active: true, id: token.id };
          }
          return token;
        });

        if (foundToken) {
          // update API state
          const response = await updateToken({ active: true, id: tokenId });
          // deal with error here... should only happen if own api is down
          // Update Query cache
          console.log("newTokenData: ", newTokenData);
          console.log("tokensQuery.data before update: ", tokensQuery.data);
          queryClient.setQueryData(["GET /token"], newTokenData);
          // tokensQuery.data is not updated at this point :(
          console.log(
            "addTokenMutationFn, reactivating, returning newTokenData = ",
            newTokenData
          );
          const queryCache = queryClient.getQueryCache();
          console.log("queryCache = ", queryCache);
          const mutationCache = queryClient.getMutationCache();
          console.log("queryCache = ", mutationCache);

          return newTokenData;
        }
      }
      // No, the token was not yet present as an archived
      // token, so we need to create a new token:
      const response = await createToken(tokenId);
      if (!("error" in response)) {
        // add the new token directly to our list of tokens in the Query
        // cache, no refetching or invalidating necessary. Note how we
        // update the query data in an immutable fashion, like we would
        // update a React state.
        queryClient.setQueryData(
          ["GET /token"],
          (oldTokenData: OwnApiToken[] | undefined): OwnApiToken[] => {
            let newTokenData: OwnApiToken[];
            if (oldTokenData) {
              newTokenData = [...oldTokenData, response];
            } else {
              newTokenData = [response];
            }
            return newTokenData;
          }
        );
        console.log(
          "addTokenMutationFn, new, returning tokensQuery.data = ",
          tokensQuery.data
        );
        return tokensQuery.data;
      }
    },
    onSuccess: () => {
      // queryClient.invalidateQueries(["GET /token"]), // not necessary
      queryClient.invalidateQueries(["GET /coins/markets"]);
    },
  });

  const archiveTokenMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      const response = await updateToken({ id: tokenId, active: false });

      if (!("error" in response)) {
        queryClient.setQueryData(
          ["GET /token"],
          (oldTokenData: OwnApiToken[] | undefined): OwnApiToken[] => {
            console.log("must remove:", tokenId);
            console.log("oldTokenData:", oldTokenData);
            let newTokenData: OwnApiToken[] = [];
            if (oldTokenData) {
              newTokenData = oldTokenData.map((token: OwnApiToken) =>
                token.id === tokenId ? { id: token.id, active: false } : token
              );
            }
            console.log("newTokenData:", newTokenData);
            return newTokenData;
          }
        );

        console.log(
          "archiveTokenMutationFn, returning tokensQuery.data = ",
          tokensQuery.data
        );
        return tokensQuery.data; // not used really as we have no onSuccess function
      }
    },
    onSuccess: () => {
      // queryClient.invalidateQueries(["GET /token"]), // not necessary
      queryClient.invalidateQueries(["GET /coins/markets"]); // not needed ?
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
  // console.log("data:", data);

  // -------------------------------------------------------------------------------

  const tokens = getTokens();

  // console.log("tokens @ homePage:", tokens);

  const addToken = (token: string) => {
    // addTokenMutation.mutate(token);
    updateToken({active: true, id: token}).then(() =>                  // TEMP!!!!! DEBUG TODO
      queryClient.invalidateQueries(["GET /token"])
    );
  };
  const removeToken = (token: string) => {
    // archiveTokenMutation.mutate(token);

    updateToken({active: false, id: token}).then(() =>                  // TEMP!!!!! DEBUG TODO
      queryClient.invalidateQueries(["GET /token"])
    );
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

        {/* {data &&
          <OverviewTable
            data={data}
          removeToken={removeToken}
        />        
        } */}

        {/* {tokens && (
          <ApiContainer
            tokens={(tokensQuery.data! as OwnApiToken[])
              .filter((token) => token.active)
              .map((token) => token.id)}
            removeToken={removeToken}
            queryState={tokensQuery.isSuccess}
          />
        )} */}

        {/* {tokens && (
          <ul>
            {data &&
              data
                .filter((token) => token.id)
                .map((token) => (
                  <li key={token.id}>
                    <button onClick={() => removeToken(token.id)}>XXX</button>{" "}
                    {token.id}
                  </li>
                ))}
          </ul>
        )} */}
      </div>
    </main>
  );
};

export default HomePage;
