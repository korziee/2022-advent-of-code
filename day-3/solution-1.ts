const input = await Deno.readTextFile("./input");

/**
 * Offset/normalise the char by its ascii representation
 */
function getPriority(char: string) {
  const UPPER_OFFSET = 38;
  const LOWER_OFFSET = 96;

  const code = char.charCodeAt(0);
  return code >= 97 ? code - LOWER_OFFSET : code - UPPER_OFFSET;
}

let totalPriority = 0;

for (const rucksack of input.split("\n")) {
  // split in half
  const [left, right] = [
    rucksack.slice(0, rucksack.length / 2),
    rucksack.slice(rucksack.length / 2),
  ];

  // a-Z is 1-52.
  const leftChars = new Array(52);
  const rightChars = new Array(52);

  for (let i = 0; i < left.length; i += 1) {
    leftChars[getPriority(left[i]) - 1] = 1;
    rightChars[getPriority(right[i]) - 1] = 1;
  }

  // find matchy matchy based on knowing we've offset the ascii rep
  // to be between 1-52 (priorities)
  for (let i = 0; i < 52; i += 1) {
    if (leftChars[i] && rightChars[i]) {
      totalPriority += i + 1;
    }
  }
}

console.log("Total Priority", totalPriority);
