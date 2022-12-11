const input = await Deno.readTextFile("./input.txt");

type Direction = "U" | "D" | "L" | "R";
type Point = { x: number; y: number };

const tailPositions = new Map<`${Point["x"]},${Point["y"]}`, number>();
// add starting position
tailPositions.set("0,0", 1);

const headPointer: Point = { x: 0, y: 0 };
const tailPointer: Point = structuredClone(headPointer);

function arePointsAdjacent(): boolean {
  // - - -
  // - h -
  // - - -
  // they are on top of each other
  if (headPointer.x === tailPointer.x && headPointer.y === tailPointer.y) {
    return true;
  }
  // - t -
  // - h -
  // - - -
  // tail is above head
  if (headPointer.x === tailPointer.x && headPointer.y + 1 === tailPointer.y) {
    return true;
  }
  // - - t
  // - h -
  // - - -
  // tail is diagonally upper right of head
  if (
    headPointer.x + 1 === tailPointer.x &&
    headPointer.y + 1 === tailPointer.y
  ) {
    return true;
  }
  // - - -
  // - h t
  // - - -
  // tail is right of head
  if (headPointer.x + 1 === tailPointer.x && headPointer.y === tailPointer.y) {
    return true;
  }

  // - - -
  // - h -
  // - - t
  // tail diagonally lower right of head
  if (
    headPointer.x + 1 === tailPointer.x &&
    headPointer.y - 1 === tailPointer.y
  ) {
    return true;
  }

  // - - -
  // - h -
  // - t -
  // tail is below head
  if (headPointer.x === tailPointer.x && headPointer.y - 1 === tailPointer.y) {
    return true;
  }

  // - - -
  // - h -
  // t - -
  // tail is diagonally lower left of head
  if (
    headPointer.x - 1 === tailPointer.x &&
    headPointer.y - 1 === tailPointer.y
  ) {
    return true;
  }

  // - - -
  // t h -
  // - - -
  // tail is left of head
  if (headPointer.x - 1 === tailPointer.x && headPointer.y === tailPointer.y) {
    return true;
  }

  // t - -
  // - h -
  // - - -
  // tail is diagonally upper left of head
  if (
    headPointer.x - 1 === tailPointer.x &&
    headPointer.y + 1 === tailPointer.y
  ) {
    return true;
  }

  return false;
}

function updateTailPositionIfRequired(previousHeadDirection: Direction) {
  if (arePointsAdjacent()) {
    return;
  }

  // snaps the tail behind the head
  // aligns x/y axis on U/D and L/R motions
  switch (previousHeadDirection) {
    case "U": {
      tailPointer.y = headPointer.y - 1;
      tailPointer.x = headPointer.x;
      break;
    }
    case "D": {
      tailPointer.y = headPointer.y + 1;
      tailPointer.x = headPointer.x;
      break;
    }
    case "L": {
      tailPointer.y = headPointer.y;
      tailPointer.x = headPointer.x + 1;
      break;
    }
    case "R": {
      tailPointer.y = headPointer.y;
      tailPointer.x = headPointer.x - 1;
      break;
    }
  }

  const key = `${tailPointer.x},${tailPointer.y}` as const;

  const timesVisited = tailPositions.get(key) ?? 0;

  tailPositions.set(key, timesVisited + 1);
}

function moveHead(direction: Direction) {
  switch (direction) {
    case "U": {
      // move y pos up
      headPointer.y += 1;
      break;
    }
    case "D": {
      headPointer.y -= 1;
      break;
    }
    case "L": {
      headPointer.x -= 1;
      break;
    }
    case "R": {
      headPointer.x += 1;
      break;
    }
  }
}

input
  .split("\n")
  .map((line) => {
    const [direction, count] = line.split(" ");
    return [direction, parseInt(count, 10)] as [Direction, number];
  })
  .forEach(([direction, count]) => {
    for (let i = 0; i < count; i += 1) {
      moveHead(direction);
      updateTailPositionIfRequired(direction);
    }
  });

console.log(tailPositions.size);
