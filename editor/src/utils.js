/*
 *  Moves an element from `from` to `to` in place
 */
export const moveInArray = (arr, from, to) => {
  if (to >= arr.length) {
    let k = to - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(to, 0, arr.splice(from, 1)[0]);
  return arr;
};
