import readAllTokens from "@/ApiQueries/ownApi/readAllTokens";

import { useQuery } from "@tanstack/react-query";

const useTokens = () => {
  const getInactiveTokens = false;
  return useQuery({
    // refetchInterval: 2000,
    queryKey: ["tokens"],
    queryFn: () => readAllTokens(getInactiveTokens),
  });
};

export default useTokens;
