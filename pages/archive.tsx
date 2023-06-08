import Header from "@/Components/Header";
import TokenButtonList from "@/Components/TokenButtonList";
import useInactiveTokens from "@/hooks/useInactiveTokens";

const ArchivePage: React.FC<{}> = ({}) => {
  const { data: tokens = [], error } = useInactiveTokens();

  return (
    <main className="p-2">
      <Header />
      <h1 className="my-2 text-2xl">Inactive tokens</h1>
      <p className="mb-2">Click on any token to reactivate it.</p>
      {tokens && <TokenButtonList tokens={tokens} />}
    </main>
  );
};

export default ArchivePage;
