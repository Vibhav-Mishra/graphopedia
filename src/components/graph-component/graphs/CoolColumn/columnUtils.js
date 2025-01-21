export const getAccArr = (accArrList) => {
  const accArr = accArrList.reduce(function (r, a) {
    a.forEach(function (b, i) {
      r[i] = {
        ...b,
        positiveAcc: (r[i]?.positiveAcc || 0) + (b.value > 0 ? b.value : 0),
      };
    });

    return r;
  }, []);
  return accArr;
};
