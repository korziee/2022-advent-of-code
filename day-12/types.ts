export type Coord = `${number},${number}`;

export type PriorityQueueItem = {
  cell: Cell;
  source: Cell | null;
  distance: number;
};

export type Cell = {
  height: number;
  position: Coord;
  edges: Cell[];
};
