// PUT on /token/<id>: update an existing token
// Api parameter: OwnApiToken
// returns: updated token object on success, error object on error

const updateToken = async (
  token: OwnApiToken
): Promise<OwnApiToken | OwnApiError> => {
  return (
    fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/token/${token.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
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

export default updateToken;
