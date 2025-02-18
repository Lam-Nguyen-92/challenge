const sum_to_n_a = (n) => [...Array(n).keys()].map(i => i + 1).reduce((acc, cur) => acc + cur, 0);

const sum_to_n_b = (n) => {
  let total = 0;
  for (let i = 0; i <= n; i++) {
    total += i;
  }
  return total;
};

const sum_to_n_c = (n) => {
  let total = 0;
  let start = 1, end = n;

  while (start < end) {
    total += start + end;
    start++;
    end--;
  }
  if (start === end) {
    total += start;
  }

  return total;
};