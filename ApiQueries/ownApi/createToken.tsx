// POST on /token: create a single token
// Api parameter: Partial<OwnApiToken> (we only need the id,
// not the "active" setting which is always true)
// returns: created token object on success, error object on error

const createToken = async (
  tokenId: string
): Promise<OwnApiToken | OwnApiError> => {
  return (
    fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tokenId),
    })
      .then((response) => response.json())
      // .then((response) => {
      //   console.log("own api response: ", response);
      //   return response;
      // })
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

export default createToken;