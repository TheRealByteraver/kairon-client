import Button from "@/Components/UI/Button";
import updateToken from "@/ApiQueries/ownApi/updateToken";

const TokenButtonList: React.FC<{ tokens: string[] }> = ({ tokens }) => {
  const buttonClickHandler = (token: string) => {
    // this should be replaced with a custom mutation
    updateToken({ id: token, active: true });
  };

  if (!tokens) return null;
  if (tokens.length === 0)
    return <p className="text-sm">No inactive tokens found...</p>;
  return (
    <ul className="">
      {tokens.map((token) => (
        <li key={token} className="mb-1">
          <Button onClick={() => buttonClickHandler(token)}>{token}</Button>
        </li>
      ))}
    </ul>
  );
};

export default TokenButtonList;