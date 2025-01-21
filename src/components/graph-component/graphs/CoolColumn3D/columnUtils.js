export const getAccArr = (accArrList) => {
  const accArr = accArrList.reduce(function (r, a) {
    a.forEach(function (b, i) {
      r[i] = { ...b, value: (r[i]?.value || 0) + b.value };
    });
    return r;
  }, []);
  return accArr;
};

export const extractLeafValues = (data) => {
  const leafValues = [];
  let subGroupIndex = 0;
  function helper(node) {
    if (Array.isArray(node)) {
      let i = 0;
      for (const item of node) {
        if (Array.isArray(item)) {
          helper(item);
        } else {
          helper({ ...item, index: i, subGroupIndex });
          i++;
        }
      }
    } else if (typeof node === 'object') {
      if (node?.value) {
        if (Array.isArray(node.value)) {
          helper(node.value);
          subGroupIndex++;
        } else {
          leafValues.push({ ...node, value: node.value });
        }
      }
    }
  }

  helper(data);
  // console.log('leafValues', leafValues);

  const groupedData = leafValues.reduce((result, item) => {
    const subGroupIndex = item.subGroupIndex;
    if (!result[subGroupIndex]) {
      result[subGroupIndex] = [];
    }
    result[subGroupIndex].push(item);
    return result;
  }, {});

  // Convert the groupedData object back to an array
  const groupedArray = Object.values(groupedData);

  groupedArray.forEach((ele, i) => {
    let value = 0;
    ele.forEach((ele1) => {
      value += ele1.value;
    });
    leafValues.push({ label: `group-${i}`, value });
  });

  // console.log(groupedArray);

  return leafValues;
};
