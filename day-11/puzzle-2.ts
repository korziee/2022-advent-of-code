const input = await Deno.readTextFile("./input.txt");

class Monkey {
  public inspectionCount = 0;

  constructor(
    public items: number[],
    public divisor: number,
    private worryCalc: (currentWorry: number) => number,
    private behaviourCalc: (currentWorry: number) => boolean,
    private behaviour: { true: number; false: number }
  ) {}

  public addItem(item: number) {
    this.items.push(item);
  }

  public inspect() {
    const item = this.items.splice(0, 1)[0];
    this.inspectionCount += 1;

    // this is absolutely magic and I still barely understand it enough to do this on my own
    // https://github.com/mebeim/aoc/blob/master/2022/README.md#day-11---monkey-in-the-middle
    // did a fantastic job of explaining the concept.
    const superModulo = monkeys
      .map((m) => m.divisor)
      .reduce((prod, div) => prod * div, 1);

    const worry = this.worryCalc(item) % superModulo;
    const res = this.behaviourCalc(worry);
    const monkeyToPassTo = this.behaviour[`${res}`];
    monkeys[monkeyToPassTo].addItem(worry);
  }

  static serialise(monkeyString: string): Monkey {
    const [_, itemsString, opString, test, truthyResultStr, falsyResultStr] =
      monkeyString.split("\n");
    const items = itemsString
      .split(":")[1]
      .split(", ")
      .map((i) => parseInt(i));
    const [var1, op, var2] = opString.split("new = ")[1].split(" ");
    // don't tell anyone how I live
    const operation = new Function("old", `return ${var1} ${op} ${var2}`);
    const divisionVal = parseInt(test.split(" ").at(-1)!);
    const behaviour = {
      true: parseInt(truthyResultStr.at(-1)!),
      false: parseInt(falsyResultStr.at(-1)!),
    };

    const monkey = new Monkey(
      items,
      divisionVal,
      operation as any,
      (current) => current % divisionVal === 0,
      behaviour
    );

    return monkey;
  }
}

const monkeys: Monkey[] = input.split("\n\n").map(Monkey.serialise);

for (let round = 0; round < 10000; round += 1) {
  monkeys.forEach((m) => {
    while (m.items.length) {
      m.inspect();
    }
  });
}

const sortedMonkeys = [...monkeys].sort(
  (m1, m2) => m2.inspectionCount - m1.inspectionCount
);

console.log(
  sortedMonkeys[0].inspectionCount * sortedMonkeys[1].inspectionCount
);
