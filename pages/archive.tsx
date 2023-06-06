import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import readAllTokens from "@/ApiQueries/ownApi/readAllTokens";
import Header from "@/Components/Header";
import TokenButtonList from "@/Components/TokenButtonList";

const ArchivePage: React.FC<{}> = ({}) => {
  // const queryClient = useQueryClient();
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
