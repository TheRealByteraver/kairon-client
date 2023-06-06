// GET on /token/<id>: get a single token
// <id> is the id of the token, e.g. "bitcoin", "ethereum"
// returns: OwnApiToken object on success, error object on error

const readToken = async (token: string): Promise<OwnApiToken | OwnApiError> => {
  return (
    fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/token/${token}`)
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

export default readToken;
