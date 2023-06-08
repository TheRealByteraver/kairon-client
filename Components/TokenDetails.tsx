import Image from "next/image";
import DownWardTrendIcon from "./UI/Icons/DownWardTrendIcon";
import UpwardTrendIcon from "./UI/Icons/UpwardTrendIcon";
import ColorSliderGraph from "./ColorSliderGraph";
import reformatString from "@/helpers/reformatString";

const TokenDetails: React.FC<{ token: CoinGeckoApiToken }> = ({ token }) => {
  // console.log(token);

  return (
    <div className="p-2">
      <h1 className="mt-8 flex items-center">
        <div className="mx-1">
          <Image width="30" height="30" src={token.image} alt="" />
        </div>
        <span className="mx-1 font-bold text-2xl">
          {token.name} (<span className="uppercase">{token.symbol}</span>)
        </span>
      </h1>
      <h2 className="ml-2 mt-2 text-3xl font-bold">
        <span className="">${reformatString(token.current_price, 2)}</span>

        {token.price_change_percentage_24h < 0 ? (
          <span className="ml-4 text-red-500 text-xl">
            <DownWardTrendIcon />
            {token.price_change_percentage_24h.toFixed(1)}%
          </span>
        ) : (
          <span className="ml-4 text-green-500 text-xl">
            <UpwardTrendIcon />
            {token.price_change_percentage_24h.toFixed(1)}%
          </span>
        )}
      </h2>
      {/* container for bottom part with two columns */}
      <div className="mt-24 w-1/2 h-12">
        <ColorSliderGraph low={token.low_24h} high={token.high_24h} value={token.current_price} />
      </div>
      {/* bottom two-column container  */}
      <div className="w-full h-36">
        {/* left half of container */}
        <div className="relative w-1/2 h-full inline-block">
          <ul className="absolute top-0 left-0 w-full h-full pr-2 inline-block">
            <li className="flex justify-between py-2 border-b-2 border-gray-300">
              <p>Market Cap</p>
              <p className="font-bold">${reformatString(token.market_cap, 0)}</p>
            </li>
            <li className="flex justify-between py-2 border-b-2 border-gray-300">
              <p>Total Volume</p>
              <p className="font-bold">
                ${reformatString(token.total_volume, 0)}
              </p>
            </li>
            <li className="flex justify-between py-2 border-b-2 border-gray-300">
              <p>Fully diluted valuation</p>
              <p className="font-bold">
                ${reformatString(token.fully_diluted_valuation, 0)}
              </p>
            </li>
          </ul>
        </div>

        {/* right half of container */}
        <div className="relative w-1/2 h-full inline-block">
          <ul className="absolute top-0 left-0 w-full h-full pl-2 inline-block">
            <li className="flex justify-between py-2 border-b-2 border-gray-300">
              <p>Circulating Supply</p>
              <p className="font-bold">${reformatString(token.circulating_supply, 0)}</p>
            </li>
            <li className="flex justify-between py-2 border-b-2 border-gray-300">
              <p>Total Supply</p>
              <p className="font-bold">
                ${reformatString(token.total_supply, 0)}
              </p>
            </li>
            <li className="flex justify-between py-2 border-b-2 border-gray-300">
              <p>Max Supply</p>
              <p className="font-bold">
                ${reformatString(token.max_supply, 0)}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
