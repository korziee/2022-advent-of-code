import { PriorityQueueItem, Coord, Cell } from "./types.ts";

// @ts-ignore
self.onmessage = (e) => {
  const { startPos, endPoint, grid, gridWidth, gridHeight } = e.data;
  // @ts-ignore
  self.postMessage(
    traverse(JSON.parse(grid), startPos, endPoint, gridWidth, gridHeight)
  );
  self.close();
};

function sortOnDistance(priorityQueue: PriorityQueueItem[]) {
  priorityQueue.sort((a, b) => {
    if (a.distance === b.distance) {
      return 0;
    }

    return a.distance - b.distance;
  });
}

function getCellFromQueue(queue: PriorityQueueItem[], pos: Coord) {
  return queue.find((a) => a.cell.position === pos)!;
}

function updateDistance(
  queue: PriorityQueueItem[],
  pos: Coord,
  distance: number,
  source?: Cell
) {
  const item = getCellFromQueue(queue, pos);
  item.distance = distance;
  if (source) {
    item.source = source;
  }
  sortOnDistance(queue);
}

function findShortestPath(
  finished: Map<Coord, PriorityQueueItem>,
  endPoint: Coord
) {
  let steps = 0;
  let stepsToA = 0;

  let edge: PriorityQueueItem | null = finished.get(endPoint)!;

  while (edge) {
    edge = finished.get(edge.source?.position!)!;
    if (edge) {
      steps += 1;
    }
    if (stepsToA === 0 && edge?.cell.height === 0) {
      stepsToA = steps;
    }
  }

  return stepsToA - 1;
}

export function traverse(
  grid: Cell[],
  startPoint: Coord,
  endPoint: Coord,
  gridWidth: number,
  gridHeight: number
) {
  const gridMap = new Map(grid.map((g) => [g.position, g]));

  // building out the graph
  for (let x = 0; x < gridWidth!; x += 1) {
    for (let y = 0; y < gridHeight!; y += 1) {
      const cell = gridMap.get(`${x},${y}`);
      if (!cell) {
        throw new Error("some bad shit happened here");
      }

      const edgeCells = [
        gridMap.get(`${x},${y + 1}`),
        gridMap.get(`${x + 1},${y}`),
        gridMap.get(`${x},${y - 1}`),
        gridMap.get(`${x - 1},${y}`),
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
  const finished = new Map<Coord, PriorityQueueItem>();

  const queue: PriorityQueueItem[] = grid.map((cell) => {
    return {
      cell,
      distance: Infinity,
      source: null,
    };
  });

  // set start point to be 0, so top of priority/processing queue
  updateDistance(queue, startPoint!, 0);

  while (queue.length) {
    const currentNode = queue.splice(0, 1).at(0)!;
    if (currentNode.distance === Infinity) {
      // console.warn("further nodes must be unvisitable", queue.length);
      break;
    }

    currentNode.cell.edges.forEach((edge) => {
      // if we've already been to edge, path is not as efficient, stop
      if (finished.has(edge.position)) {
        return;
      }

      const edgeQueueItem = getCellFromQueue(queue, edge.position);
      if (
        edgeQueueItem.distance === Infinity ||
        currentNode.distance + 1 < edgeQueueItem.distance
      ) {
        updateDistance(
          queue,
          edge.position,
          currentNode.distance + 1,
          currentNode.cell
        );
      }
    });

    finished.set(currentNode.cell.position, currentNode);
  }

  return findShortestPath(finished, endPoint);
}
