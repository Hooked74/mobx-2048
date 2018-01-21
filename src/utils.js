export const uniq = () => {
  const unixTime = Date.now();

  return (
    unixTime +
    // eslint-disable-next-line
    parseInt(Math.random() * Math.pow(10, unixTime.toString().length))
  );
};
