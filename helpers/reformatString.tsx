// this functions puts comma's in large numbers
// 'dec' specifies how many decimals should be rendered
const reformatString = (nr: number, dec: number) => {
  if (nr) {
    return nr.toLocaleString("en-US", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
  }
  return " n/a";
};

export default reformatString;