import { draw } from "./tools.ts";

const input = await Deno.readTextFile("./input.txt");

export type Context = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};
export type Coord = `${number},${number}`;
export type Grid = Map<Coord, "air" | "rock" | "sand">;

function setMinMax(coords: number[][], gridContext: Context): number[][] {
  coords.forEach((c) => {
    const x = c[0];
    const y = c[1];
    if (x < gridContext.minX) {
      gridContext.minX = x;
    }
    if (x > gridContext.maxX) {
      gridContext.maxX = x;
    }
    if (y < gridContext.minY) {
      gridContext.minY = y;
    }
    if (y > gridContext.maxY) {
      gridContext.maxY = y;
    }
  });
  return coords;
}

function groupIntoRangePairs(coords: number[][]): number[][][] {
  return coords
    .map((coord, i, arr) => (i === arr.length - 1 ? [] : [coord, arr[i + 1]]))
    .map((pair) =>
      pair.sort((p1, p2) => {
        // if x are same, sort on y ascending
        if (p1[0] === p2[0]) {
          return p1[1] - p2[1];
        }
        // otherwise sort by x
        return p1[0] - p2[0];
      })
    )
    .filter((x) => x.length);
}

function buildGrid(coordRanges: number[][][], gridContext: Context): Grid {
  const grid = new Map<Coord, "air" | "rock" | "sand">();

  // set everything to air
  for (let x = gridContext.minX; x <= gridContext.maxX; x += 1) {
    for (let y = gridContext.minY; y <= gridContext.maxY; y += 1) {
      grid.set(`${x},${y}`, "air");
    }
  }

  coordRanges.forEach((range) => {
    // ranges are always lines, no cuboid structures
    const direction = range[0][0] === range[1][0] ? "vertical" : "horizontal";
    if (direction === "horizontal") {
      for (let x = range[0][0]; x <= range[1][0]; x += 1) {
        grid.set(`${x},${range[0][1]}`, "rock");
      }
    } else {
      for (let y = range[0][1]; y <= range[1][1]; y += 1) {
        grid.set(`${range[0][0]},${y}`, "rock");
      }
    }
  });

  return grid;
}

function parseLine(line: string) {
  return line
    .split(" -> ")
    .map((l) => l.split(",").map((num) => parseInt(num)));
}

const ctx: Context = {
  minX: Infinity,
  minY: 0, // hardcoded based off of where sand falls from
  maxX: -Infinity,
  maxY: -Infinity,
};

const grid = buildGrid(
  input
    .split("\n")
    .map(parseLine)
    .map((v) => setMinMax(v, ctx))
    .map(groupIntoRangePairs)
    .flatMap((x) => x),
  ctx
);

/**
 * Best to be recursive
 *
 * @returns a coordinate for sand to rest at
 * @returns null if out of bounds (void)
 */
function locateSandRestPosition(
  start: Readonly<[number, number]>,
  grid: Grid,
  gridContext: Context
): Coord | null {
  // check below, if can go below, go down and recurse
  const down = [start[0], start[1] + 1] as const;
  if (grid.get(`${down[0]},${down[1]}`) === "air") {
    return locateSandRestPosition(down, grid, gridContext);
  }

  // if cannot go down, check bottom left, if empty, go there, recurse
  const downLeft = [start[0] - 1, start[1] + 1] as const;
  const downLeftCellContents = grid.get(`${downLeft[0]},${downLeft[1]}`);
  if (!downLeftCellContents) {
    // in void!
    return null;
  }
  if (downLeftCellContents === "air") {
    return locateSandRestPosition(downLeft, grid, gridContext);
  }

  // if cannot go down or go bottom left, check bottom right, if empty, go there, recurse
  const downRight = [start[0] + 1, start[1] + 1] as const;
  const downRightCellContents = grid.get(`${downRight[0]},${downRight[1]}`);
  if (!downRightCellContents) {
    // in void!
    return null;
  }
  if (downRightCellContents === "air") {
    return locateSandRestPosition(downRight, grid, gridContext);
  }

  // if cannot go down or go bottom left, or go bottom bottom right, return position
  return `${start[0]},${start[1]}`;
}

/**
 * simulates sand falling/physics behaviour, returns false when sand is
 * falling into void
 */
function simulateSandFalling(
  grid: Grid,
  gridContext: Context,
  fallPoint: [number, number]
): boolean {
  const restPos = locateSandRestPosition(fallPoint, grid, gridContext);

  if (restPos === null) {
    return false;
  }

  grid.set(restPos, "sand");

  return true;
}

let moves = -1;

do {
  moves += 1;
} while (simulateSandFalling(grid, ctx, [500, 0]));

draw(grid, ctx);
console.log(moves, ctx);
