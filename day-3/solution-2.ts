const input = await Deno.readTextFile("./input");

const groups: string[][] = [];
let tempGroup: string[] = [];
let counter = 0;

input.split("\n").forEach((line) => {
  tempGroup.push(line);
  counter += 1;

  if (counter === 3) {
    groups.push(tempGroup);
    counter = 0;
    tempGroup = [];
  }
});

/**
 * Offset/normalise the char by its ascii representation
 */
function getPriority(char: string) {
  if (!char) {
    return 0;
  }

  const UPPER_OFFSET = 38;
  const LOWER_OFFSET = 96;

  const code = char.charCodeAt(0);
  return code >= 97 ? code - LOWER_OFFSET : code - UPPER_OFFSET;
}

let totalPriority = 0;

for (const [left, centre, right] of groups) {
  // a-Z is 1-52.
  const leftChars = new Array(52);
  const centreChars = new Array(52);
  const rightChars = new Array(52);

  // group members are unbalanced, find longest to avoid multiple iterations
  for (
    let i = 0;
    i < Math.max(left.length, centre.length, right.length);
    i += 1
  ) {
    leftChars[getPriority(left[i]) - 1] = 1;
    centreChars[getPriority(centre[i]) - 1] = 1;
    rightChars[getPriority(right[i]) - 1] = 1;
  }

  // find matchy matchy
  for (let i = 0; i < 52; i += 1) {
    if (leftChars[i] && centreChars[i] && rightChars[i]) {
      totalPriority += i + 1;
    }
  }
}

console.log("Badge Priority", totalPriority);
