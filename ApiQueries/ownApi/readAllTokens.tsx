// GET on /tokens?query=(in)active: get all (inactive) tokens
// returns: array of OwnApiToken objects on success, throws error on error

const readAllTokens = (getInactiveTokens: boolean): Promise<OwnApiToken[]> => {
  const queryString = getInactiveTokens ? '?query=inactive' : '?query=active';

  return (
    fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/tokens${queryString}`)
      .then((response) => response.json())
      // .then(response => {
      //   console.log('response:', response);
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

export default readAllTokens;
