// PATCH on /tokens/<id>: update an existing token
// Api parameter: OwnApiToken
// returns: updated token object on success, throws error on error

const updateToken = async (
  token: Partial<OwnApiToken>
): Promise<OwnApiToken> => {
  return (
    fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/tokens/${token.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
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

export default updateToken;