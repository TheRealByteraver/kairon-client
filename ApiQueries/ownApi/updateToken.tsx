// PUT on /token/<id>: update an existing token
// Api parameter: OwnApiToken
// returns: updated token object on success, error object on error

import { useMutation, useQueryClient } from "@tanstack/react-query";

type Payload = {
  id: string;
  active: boolean;
};

const updateToken = async (
  payload: Payload
): Promise<Payload | OwnApiError> => {
  return (
    fetch(`${process.env.NEXT_PUBLIC_TOKEN_API_URL}/token/${payload.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: payload.active }),
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

function useUpateToken() {
  const queryClient = useQueryClient();
  return useMutation(payload => updateToken(payload), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["tokens"])
    }
  })
}

export default useUpateToken;

// export default updateToken;
