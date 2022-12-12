const input = await Deno.readTextFile("./input.txt");

class Monkey {
  public inspectionCount = 0;

  constructor(
    public items: number[],
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
    const worry = Math.floor(this.worryCalc(item) / 3);
    const monkeyToPassTo = this.behaviour[`${this.behaviourCalc(worry)}`];
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
      operation as any,
      (current) => current % divisionVal === 0,
      behaviour
    );

    return monkey;
  }
}

const monkeys: Monkey[] = input.split("\n\n").map(Monkey.serialise);

for (let round = 0; round < 20; round += 1) {
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
