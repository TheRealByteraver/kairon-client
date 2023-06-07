import updateToken from "@/ApiQueries/ownApi/updateToken";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpateToken = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: OwnApiToken) => updateToken(payload), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tokens"])
    }
  })
}

export default useUpateToken;