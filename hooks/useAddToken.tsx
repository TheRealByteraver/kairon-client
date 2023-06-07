import createToken from "@/ApiQueries/ownApi/createToken";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAddToken = () => {
  const queryClient = useQueryClient();
  return useMutation((tokenName: string) => createToken(tokenName), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tokens"])
    }
  })
}

export default useAddToken;