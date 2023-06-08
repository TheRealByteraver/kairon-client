import updateToken from "@/ApiQueries/ownApi/updateToken";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpateToken = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: OwnApiToken) => updateToken(payload), {
    onSuccess: (data, variables) => {
      // updating a token from active to inactive or vice versa
      // makes both queries ["tokens"] and ["inactiveTokens"] stale
      // so both must be invalidated here.
      queryClient.invalidateQueries(["tokens"])
      queryClient.invalidateQueries(["inactiveTokens"])
    }
  })
}

export default useUpateToken;