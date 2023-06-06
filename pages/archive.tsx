import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import readAllTokens from "@/ApiQueries/ownApi/readAllTokens";
import Header from "@/Components/Header";
import TokenButtonList from "@/Components/TokenButtonList";

const ArchivePage: React.FC<{}> = ({}) => {
  // const queryClient = useQueryClient();
  const tokensQuery = useQuery({
    refetchInterval: 1 * 1000,
    // "queryKey" is always an array and should be unique across all queries
    queryKey: ["GET /token"],
    // force error with: queryFn: () => Promise.reject("The error message here")
    queryFn: readAllTokens,
  });

  // const addTokenMutation = useMutation({
  //   // Supposedly we should set the Query Data (react-query's internal cache)
  //   // in an onSuccess() function rather than in the mutationFn directly but
  //   // the below approach is more feasible as we need different api functions
  //   // here (we need to either un-archive the token or create it):
  //   mutationFn: async (tokenId: string) => {
  //     // check if the token is present in the list of archived
  //     // tokens and if so, simply reactivate it:
  //     if (tokensQuery.data && !("error" in tokensQuery.data)) {
  //       let foundToken = false;
  //       const newTokenData = tokensQuery.data.map((token: OwnApiToken) => {
  //         if (token.id === tokenId) {
  //           foundToken = true;
  //           return { id: token.id, active: true };
  //         }
  //         return token;
  //       });

  //       if (foundToken) {
  //         // Update Query cache
  //         queryClient.setQueryData(["GET /token"], newTokenData);
  //         // update API state
  //         const response = await updateToken({ id: tokenId, active: true });
  //         // deal with error here... should only happen if own api is down
  //         // all done
  //         return tokensQuery.data;
  //       }
  //     }
  //     // No, the token was not yet present as an archived
  //     // token, so we need to create a new token:
  //     const response = await createToken(tokenId);
  //     if (!("error" in response)) {
  //       // add the new token directly to our list of tokens in the Query
  //       // cache, no refetching or invalidating necessary. Note how we
  //       // update the query data in an immutable fashion, like we would
  //       // update a React state.
  //       queryClient.setQueryData(
  //         ["GET /token"],
  //         (oldTokenData: OwnApiToken[] | undefined): OwnApiToken[] => {
  //           let newTokenData: OwnApiToken[];
  //           if (oldTokenData) {
  //             newTokenData = [...oldTokenData, response];
  //           } else {
  //             newTokenData = [response];
  //           }
  //           return newTokenData;
  //         }
  //       );
  //     }
  //   },
  // });

  const getTokens = (): string[] | undefined => {
    if (
      tokensQuery.isLoading ||
      tokensQuery.isError ||
      "error" in tokensQuery.data
    ) {
      return undefined;
    }
    return tokensQuery.data
      .filter((token: OwnApiToken) => !token.active)
      .map((token: OwnApiToken) => token.id);
  };

  const tokens = getTokens();
  console.log("tokens @ ArchivePage:", tokens);

  return (
    <main className="p-2">
      <Header />
      <h1 className="my-2 text-2xl">Inactive tokens</h1>
      <p className="mb-2">Click on any token to reactivate it.</p>
      {tokens && <TokenButtonList tokens={tokens} />}
    </main>
  );
};

export default ArchivePage;
