import { Context, Grid } from "./puzzle-1.ts";

export function draw(grid: Grid, { maxX, maxY, minX, minY }: Context) {
  const row = new Set<string>();
  const cols = [];
  for (let y = minY; y <= maxY; y += 1) {
    let col = `${y} `.padStart(4, " ");
    for (let x = minX; x <= maxX; x += 1) {
      row.add(`${x}`);
      const type = grid.get(`${x},${y}`);
      col += type === "air" ? "." : type === "rock" ? "*" : "o";
      col += " ";
    }
    cols.push(col);
    // console.log(col);
  }

  console.log(
    "  ",
    [...row.values()].reduce((prev, curr) => `${prev} ${curr[2]}`, "")
  );

  cols.forEach((col) => console.log(col));

  console.log(
    "  ",
    [...row.values()].reduce((prev, curr) => `${prev} ${curr[2]}`, "")
  );
}
