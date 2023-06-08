import Button from "@/Components/UI/Button";
import useUpateToken from "@/hooks/useUpateToken";

const TokenButtonList: React.FC<{ tokens: OwnApiToken[] }> = ({ tokens }) => {
  const { mutate: updateTokenMutate } = useUpateToken();

  const buttonClickHandler = (token: OwnApiToken) => {
    console.log("now reactivating token: ", token);
    updateTokenMutate({ id: token.id, active: 1 });
  };

  if (!tokens) return null;

  if (tokens.length === 0)
    return <p className="text-sm">No inactive tokens found...</p>;

  return (
    <ul className="flex flex-wrap">
      {tokens.map((token) => (
        <li key={token.id} className="mb-1">
          <Button onClick={() => buttonClickHandler(token)}>{token.name}</Button>
        </li>
      ))}
    </ul>
  );
};

export default TokenButtonList;