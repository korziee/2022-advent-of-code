const input = await Deno.readTextFile("./input.txt");

type CPUType = {
  registers: Record<"a", number>;
};

type Instruction = {
  command: "addx" | "noop";
  parameters: string[];
  cycles: number;
  delegate(cpu: CPUType): void;
};

const computer = {
  cpu: {
    registers: {
      a: 1,
    },
  },
  sprite: {
    xPos: 0,
  },
  crt: {
    nextPixel: {
      x: 0,
      y: 0,
    },
    state: Array.from(Array(6)).map(() => Array.from(Array(40))) as string[][],
    draw() {
      let char = ".";
      if (
        this.nextPixel.x === computer.sprite.xPos ||
        this.nextPixel.x === computer.sprite.xPos - 1 ||
        this.nextPixel.x === computer.sprite.xPos + 1
      ) {
        char = "#";
      }

      this.state[this.nextPixel.y][this.nextPixel.x] = char;
      this.nextPixel.x += 1;

      // handle overflow
      if (this.nextPixel.x === 40) {
        this.nextPixel.x = 0;
        this.nextPixel.y += 1;
      }
    },
  },
};

function parseInstructionString(str: string): Instruction {
  const [instr, ...args] = str.split(" ");

  if (instr === "noop") {
    return {
      command: instr,
      parameters: args,
      cycles: 1,
      // noop
      delegate() {},
    };
  }

  if (instr === "addx") {
    return {
      command: instr,
      parameters: args,
      cycles: 2,
      delegate(cpu) {
        cpu.registers.a += parseInt(args[0], 10);
      },
    };
  }

  throw new Error(`unexpected instruction ${instr}`);
}

const instructions = input.split("\n").map(parseInstructionString);

let totalCycleCount = 0;
let signalStrengthSum = 0;

for (let i = 0; i < instructions.length; i += 1) {
  const instr = instructions[i];
  let clockCycles = instr.cycles;

  while (clockCycles) {
    totalCycleCount += 1;
    // puzzle-1
    if ([20, 60, 100, 140, 180, 220].includes(totalCycleCount)) {
      signalStrengthSum += totalCycleCount * computer.cpu.registers.a;
    }
    // puzzle-2
    computer.crt.draw();

    clockCycles -= 1;
  }

  instr.delegate(computer.cpu);
  // update sprite pos
  computer.sprite.xPos = computer.cpu.registers.a;
}

// puzzle-1
console.log(signalStrengthSum);

// puzzle-2
computer.crt.state.forEach((column) => {
  let rowPixels = "";
  column.forEach((pixel) => {
    rowPixels += pixel;
  });
  console.log(rowPixels);
});
