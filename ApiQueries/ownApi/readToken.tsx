// GET on /tokens/<id>: get a single token
// <id> is the id aka primary key of the token, e.g. 1, 2, 3, etc
// returns: OwnApiToken object on success, throws error on error

const readToken = async (tokenId: number): Promise<OwnApiToken> => {
  return (
    fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/tokens/${tokenId}`)
      .then((response) => response.json())
      .then((response) => {
        if (response.error !== undefined) {
          console.log("response.error:", response.error);
          throw new Error(response.error);
        }
        return response;
      })
      .catch((error) => {
        throw new Error(error);
      })
  );
};

export default readToken;
