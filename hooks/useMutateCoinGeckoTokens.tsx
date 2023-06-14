
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutateCoinGeckoTokens = () => {
  const queryClient = useQueryClient();
  return useMutation(() => {}, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["coinGeckoTokens"]);
    }
  })
}

export default useMutateCoinGeckoTokens;

import createToken from "@/ApiQueries/ownApi/createToken";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAddToken = () => {
  const queryClient = useQueryClient();
  return useMutation((tokenName: string) => createToken(tokenName), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tokens"])
      // We need to invalidate ["inactiveTokens"] here because,
      // when we try to add a token to the database that already
      // exists in the database as an _inactive_ token, it will
      // simply reactivate it, therefore making the previous
      // ["inactiveTokens"] query stale.
      queryClient.invalidateQueries(["inactiveTokens"])
    }
  })
}

// export default useAddToken;