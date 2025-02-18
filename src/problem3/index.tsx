interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // add blockchain để avoid TypeScript error
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps { }

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances: FormattedWalletBalance[] = useMemo(() => {
    return balances
      .map((balance) => {
        const priority = getPriority(balance.blockchain);
        return {
          ...balance,
          formatted: balance.amount.toFixed(),
          usdValue: (prices[balance.currency] || 0) * balance.amount,
          priority,
        };
      })
      .filter((balance) => balance.priority > -99 && balance.amount > 0)
      .sort((a, b) => b.priority - a.priority);
  }, [balances, prices]);

  return (
    <div {...rest}>
      {sortedBalances.map((balance) => (
        <WalletRow
          className={classes.row}
          key={balance.currency} // Dùng currency làm key thay vì index
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};
