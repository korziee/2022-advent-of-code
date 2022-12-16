import * as mod from "https://deno.land/std@0.167.0/fmt/colors.ts";
import { Cell, Coord, PriorityQueueItem } from "./types.ts";

const input = await Deno.readTextFile("./input.txt");

let endPoint: Coord;
let gridWidth: number;
let gridHeight: number;

const grid = new Map<Coord, Cell>();

input.split("\n").forEach((line, y) => {
  gridHeight = (gridHeight || 0) + 1;
  gridWidth = line.length;

  line.split("").forEach((height, x) => {
    if (height === "S") {
      grid.set(`${x},${y}`, {
        height: 0,
        position: `${x},${y}`,
        edges: [],
      });
    } else if (height === "E") {
      grid.set(`${x},${y}`, {
        height: "z".charCodeAt(0) - 97,
        position: `${x},${y}`,
        edges: [],
      });
      endPoint = `${x},${y}`;
    } else {
      grid.set(`${x},${y}`, {
        height: height.charCodeAt(0) - 97,
        position: `${x},${y}`,
        edges: [],
      });
    }
  });
});

function drawPath(edge: PriorityQueueItem, finished: PriorityQueueItem[]) {
  const arr = [];
  for (let y = 0; y < gridHeight!; y += 1) {
    const col = [];
    for (let x = 0; x < gridWidth!; x += 1) {
      col.push("-");
    }
    arr.push(col);
  }

  let start = true;
  let edgecopy = edge;

  while (edgecopy) {
    const [x, y] = edgecopy.cell.position.split(",");
    arr[parseInt(y)][parseInt(x)] = start ? "&" : "*";
    start = false;
    edgecopy = finished.find(
      (a) => a.cell.position === edgecopy.source?.position
    )!;
  }

  for (let y = 0; y < gridHeight!; y += 1) {
    let print = "";
    for (let x = 0; x < gridWidth!; x += 1) {
      const str = String.fromCharCode(grid.get(`${x},${y}`)?.height! + 97);
      const cc = finished.find((a) => a.cell.position === `${x},${y}`);
      const char = arr[y][x];
      print += char;
      // if (cc) {
      //   print += mod.bgGreen(str);
      // } else {
      //   print += mod.bgMagenta(str);
      // }
    }
    console.log(print);
  }
}

let steps = Infinity;

// this is hella inefficient - room for improvement would be finding the earliest node that ALL starting points reach
// and then calculate distance to that position, and use that to find shortest
for (let y = 0; y < gridHeight!; y += 1) {
  const worker = new Worker(new URL("./worker.ts", import.meta.url).href, {
    type: "module",
  });

  worker.onmessage = function (e) {
    const s = parseInt(e.data, 10);

    if (s < steps) {
      steps = s;
      console.log("Shortest path:", steps);
    }
  };

  worker.postMessage({
    grid: JSON.stringify([...grid.values()]),
    startPos: `${0},${y}`,
    endPoint: endPoint!,
    gridWidth: gridWidth!,
    gridHeight: gridHeight!,
  });
}
