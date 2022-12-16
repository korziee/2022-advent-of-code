const input = await Deno.readTextFile("./input.txt");

function inOrder(
  left: number | Array<number>,
  right: number | Array<number>
): null | boolean {
  if (Number.isInteger(left) && Number.isInteger(right)) {
    if (left === right) {
      return null;
    }
    return left < right;
  }

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

  if (Array.isArray(left) && Number.isInteger(right)) {
    return inOrder(left, [right as number]);
  }
  if (Array.isArray(right) && Number.isInteger(left)) {
    return inOrder([left as number], right);
  }

  throw new Error("something gone real bad");
}

const parsed = input
  .split("\n\n")
  .map((pair) => pair.split("\n"))
  .map((p) => [eval(p[0]), eval(p[1])]);

const puzzle1 = parsed
  .map((p, i) => (inOrder(p[0], p[1]) ? i + 1 : 0))
  .reduce((sum, index) => sum + index, 0);

const puzzle2 = [...parsed, [[[2]], [[6]]]]
  .flatMap((p) => p)
  .sort((a, b) => {
    const res = inOrder(a, b);
    if (res === null) {
      return 0;
    }
    return res ? -1 : 1;
  })
  .map((v, i) => (["[[2]]", "[[6]]"].includes(JSON.stringify(v)) ? i + 1 : 1))
  .reduce((sum, index) => sum * index, 1);

console.log("Puzzle 1 = ", puzzle1);
console.log("Puzzle 2 = ", puzzle2);
