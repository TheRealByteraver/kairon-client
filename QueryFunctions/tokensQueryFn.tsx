const tokensQueryFn = (): Promise<OwnApiToken[]> | OwnApiToken[] => {
  // The below IF statement was added to debug the CSS issue with Vercel:
  // We want to see at least two tokens in the list.
  if (!process.env.NEXT_PUBLIC_TOKEN_API_URL) {
    return [
      { id: "bitcoin", active: true },
      { id: "ethereum", active: true },
    ];
  }

  return (
    fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/token`)
      .then((response) => response.json())
      // .then((body) => {
      //   console.log("own api response: ", body);
      //   return body;
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

export default tokensQueryFn;
