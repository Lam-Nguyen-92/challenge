import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface Token {
  currency: string;
  date: string;
  price: number;
  imageURL: string;
}

export default function CurrencySwap() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState<string>();
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Token[]>("https://interview.switcheo.com/prices.json").then((res) => {
      const validTokens = res.data
        .filter((token) => token.price)
        .map((token) => ({
          ...token,
          imageURL: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token.currency}.svg`,
        }));
      setTokens(validTokens);
      setFrom(validTokens[0].currency);
      setTo(validTokens[0].currency);
    });
  }, []);

  const validateAmount = useCallback(() => {
    if (amount === undefined) return;
    if (!amount) {
      setError("Please enter amount.");
      return false;
    }
    const numericValue = parseFloat(amount);
    if (isNaN(numericValue) || numericValue <= 0) {
      setError("Money must be a valid number.");
      return false;
    }
    setError(null);
    return true;
  }, [amount]);

  const handleExchange = async () => {
    if (!validateAmount()) return;

    const fromToken = tokens.find((t) => t.currency === from);
    const toToken = tokens.find((t) => t.currency === to);
    if (fromToken && toToken && amount) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const converted = parseFloat(amount) * fromToken.price / toToken.price;
      setResult(converted);
      setIsLoading(false);
    }
  };

  const swapCurrency = () => {
    setFrom(to);
    setTo(from);
  };

  useEffect(() => {
    validateAmount();
  }, [validateAmount]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-7xl p-6 shadow-xl rounded-2xl">
        <h2 className="text-xl font-semibold text-center mb-4">Currency Swap</h2>
        <div className="flex gap-8">
          <div className="border border-gray-300 p-4 rounded-lg text-gray-700 font-semibold flex-1 relative">
            <label className="text-sm text-gray-500">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              className="w-full text-2xl font-bold bg-transparent focus:outline-none"
            />
            {error && <p className="text-red-500 text-sm mt-1 absolute -bottom-6">{error}</p>}
          </div>
          <div className="flex relative flex-grow-[2] basis-0 gap-6">
            <div className="border border-gray-300 p-4 rounded-lg flex flex-col flex-1 gap-2">
              <label className="text-sm text-gray-500">From</label>
              <div className="flex gap-1">
                <img width={24} src={tokens.find((t) => t.currency === from)?.imageURL} />
                <select
                  className="flex-1 text-lg font-semibold focus:outline-none bg-transparent"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                >
                  {tokens.map((token) => (
                    <option key={token.currency} value={token.currency}>
                      {token.currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 z-20 m-auto flex -translate-x-1/2 -translate-y-1/2 transform cursor-pointer">
              <button
                className="inline-flex rounded-full border border-solid border-gray-300 bg-white p-4 hover:bg-gray-700"
                aria-label="Swap currencies"
                type="button"
                onClick={swapCurrency}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 17"
                  aria-hidden="true"
                  className="h-4 w-4 rotate-90 text-greyblue-400 md:rotate-0"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M11.726 1.273l2.387 2.394H.667V5h13.446l-2.386 2.393.94.94 4-4-4-4-.94.94zM.666 12.333l4 4 .94-.94L3.22 13h13.447v-1.333H3.22l2.386-2.394-.94-.94-4 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="border border-gray-300 p-4 rounded-lg flex flex-col flex-1 gap-2">
              <label className="text-sm text-gray-500">To</label>
              <div className="flex gap-1">
                <img width={24} src={tokens.find((t) => t.currency === to)?.imageURL} />
                <select
                  className="flex-1 text-lg font-semibold focus:outline-none bg-transparent"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                >
                  {tokens.map((token) => (
                    <option key={token.currency} value={token.currency}>
                      {token.currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right mt-4">
          <button
            disabled={isLoading}
            onClick={handleExchange}
            className="order-1 h-fit w-full rounded-lg bg-blue-500 px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-blue-450 md:order-2 md:w-[234px]"
          >
            {isLoading ? (
              <>
                <div className="absolute left-4 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 animate-pulse">
                  Loading<span className="animate-pulse">.</span>
                  <span className="animate-pulse delay-150">.</span>
                  <span className="animate-pulse delay-300">.</span>
                  <span className="animate-pulse delay-450">.</span>
                </span>
              </>
            ) : (
              <div>Exchange</div>
            )}
          </button>
        </div>
        {result && (
          <p className="mt-4 text-center text-lg font-semibold">
            {amount} {from} = {result.toFixed(6)} {to}
          </p>
        )}
      </div>
    </div>
  );
}
