// POST on /tokens: create a single token
// Api parameter: Partial<OwnApiToken> (we only need the name of the token,
// not the "active" setting which is always true)
// returns: created token object on success, error object on error

const createToken = async (
  tokenName: string
): Promise<OwnApiToken> => {
  return (
    fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: tokenName }),
    })
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

export default createToken;