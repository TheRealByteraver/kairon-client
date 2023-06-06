// DELETE on /token: delete a single token
// Api parameter: Partial<OwnApiToken>
// returns: deleted token object on success, error object on error

const deleteToken = async (
  token: Partial<OwnApiToken>
): Promise<OwnApiToken | OwnApiError> => {
  return (
    fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/token/${token.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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

export default deleteToken;
