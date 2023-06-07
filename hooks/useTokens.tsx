import readAllTokens from "@/ApiQueries/ownApi/readAllTokens";

import { useQuery } from "@tanstack/react-query";

const useTokens = () => {
  const getInactiveTokens = false;
  return useQuery(["tokens"], () => readAllTokens(getInactiveTokens))
}

export default useTokens;
