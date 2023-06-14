import readAllTokens from "@/ApiQueries/ownApi/readAllTokens";

import { useQuery } from "@tanstack/react-query";

const useTokens = () => {
  const getInactiveTokens = false;
  return useQuery({
    queryKey: ["tokens"],
    queryFn: async () => readAllTokens(getInactiveTokens)
  });
};

export default useTokens;
