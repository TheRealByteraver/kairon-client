import readAllTokens from "@/ApiQueries/ownApi/readAllTokens";

import { useQuery } from "@tanstack/react-query";

const useInactiveTokens = () => {
  const getInactiveTokens = true;
  return useQuery(["inactiveTokens"], () => readAllTokens(getInactiveTokens))
}

export default useInactiveTokens;