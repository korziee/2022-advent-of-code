// guess I need a pathfinding algorithm
// dijkstra ok

import * as mod from "https://deno.land/std@0.167.0/fmt/colors.ts";

const input = await Deno.readTextFile("./input.txt");

type Coord = `${number},${number}`;

type PriorityQueueItem = {
  cell: Cell;
  source: Cell | null;
  distance: number;
};

let startPoint: Coord;
let endPoint: Coord;
let gridWidth: number;
let gridHeight: number;

type Cell = {
  height: number;
  position: Coord;
  edges: Cell[];
};

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
      startPoint = `${x},${y}`;
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

// building out the graph
for (let x = 0; x < gridWidth!; x += 1) {
  for (let y = 0; y < gridHeight!; y += 1) {
    const cell = grid.get(`${x},${y}`);
    if (!cell) {
      throw new Error("some bad shit happened here");
    }

    const edgeCells = [
      grid.get(`${x},${y + 1}`),
      grid.get(`${x + 1},${y}`),
      grid.get(`${x},${y - 1}`),
      grid.get(`${x - 1},${y}`),
    ];

    edgeCells.forEach((edge) => {
      // some cells won't have edges on all sides
      // edge cells are only edges IF we can reach them
      // OR FFS they are edge cells if they are of lower height? what a stitch up.
      if (edge) {
        if (
          edge.height === cell.height ||
          edge.height < cell.height ||
          edge.height - 1 === cell.height
        ) {
          cell.edges.push(edge);
        }
      }
    });
  }
}

function sortOnDistance(priorityQueue: PriorityQueueItem[]) {
  priorityQueue.sort((a, b) => {
    if (a.distance === b.distance) {
      return 0;
    }

    return a.distance - b.distance;
  });
}

function getCellFromQueue(pos: Coord) {
  return queue.find((a) => a.cell.position === pos)!;
}

function updateDistance(pos: Coord, distance: number, source?: Cell) {
  const item = getCellFromQueue(pos);
  item.distance = distance;
  if (source) {
    item.source = source;
  }
  sortOnDistance(queue);
}

const finished: PriorityQueueItem[] = [];

const queue: PriorityQueueItem[] = [...grid.values()].map((cell) => {
  return {
    cell,
    distance: Infinity,
    source: null,
  };
});

// set start point to be 0, so top of priority/processing queue
updateDistance(startPoint!, 0);

while (queue.length) {
  const currentNode = queue.splice(0, 1).at(0)!;
  if (currentNode.distance === Infinity) {
    console.warn("further nodes must be unvisitable", queue.length);
    break;
  }

  currentNode.cell.edges.forEach((edge) => {
    // if we've already been to edge, path is not as efficient, stop
    if (finished.find((a) => a.cell.position === edge.position)) {
      return;
    }
    const edgeQueueItem = getCellFromQueue(edge.position);
    if (
      edgeQueueItem.distance === Infinity ||
      currentNode.distance + 1 < edgeQueueItem.distance
    ) {
      updateDistance(edge.position, currentNode.distance + 1, currentNode.cell);
    }
  });

  finished.push(currentNode);
}

function drawPath(edge: PriorityQueueItem) {
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
      if (cc) {
        print += mod.bgGreen(str);
      } else {
        print += mod.bgMagenta(str);
      }
    }
    console.log(print);
  }
}
let steps = 0;

let edge: PriorityQueueItem | null = finished.find(
  (a) => a.cell.position === endPoint
)!;

while (edge) {
  edge = finished.find((e) => e.cell.position === edge!.source?.position)!;
  if (edge) {
    steps += 1;
  }
}

console.log("SMALLEST DISTANCE:", steps);

// drawPath(finished.at(finished.length - 1));
