const input = await Deno.readTextFile("./input.txt");

function inOrder(
  left: number | Array<number>,
  right: number | Array<number>
): null | boolean {
  // If both values are integers, the lower integer should come first.
  // If the left integer is lower than the right integer, the inputs are in the right order.
  // If the left integer is higher than the right integer, the inputs are not in the right order.
  // Otherwise, the inputs are the same integer; continue checking the next part of the input.
  if (Number.isInteger(left) && Number.isInteger(right)) {
    if (left === right) {
      return null;
    }
    return left < right;
  }

  // If the left list runs out of items first, the inputs are in the right order.
  // If the right list runs out of items first, the inputs are not in the right order.
  // If both values are lists, compare the first value of each list, then the second value, and so on.
  // If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.
  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
      if (typeof left[i] === "undefined") {
        return true;
      }
      if (typeof right[i] === "undefined") {
        return false;
      }

      const arrInOrder = inOrder(left[i], right[i]);
      if (arrInOrder === false) {
        return false;
      }
      if (arrInOrder === true) {
        return true;
      }
    }
    return null;
  }

  // If exactly one value is an integer, convert the integer to a list which contains that integer as its only value,then retry the comparison.

  if (Array.isArray(left) && Number.isInteger(right)) {
    return inOrder(left, [right as number]);
  }
  if (Array.isArray(right) && Number.isInteger(left)) {
    return inOrder([left as number], right);
  }

  throw new Error("something gone real bad");
}

const result = input
  .split("\n\n")
  .map((pair) => pair.split("\n"))
  .map((p) => [eval(p[0]), eval(p[1])])
  .map((p, i) => (inOrder(p[0], p[1]) ? i + 1 : 0))
  .reduce((sum, index) => sum + index, 0);

console.log("Puzzle 1 = ", result);
