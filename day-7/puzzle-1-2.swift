import Foundation

// read input
let path = URL(fileURLWithPath: "").appendingPathComponent("input")

let input: String = {
  do {
    return try String(
      contentsOf: path,
      encoding: .utf8
    )
  } catch {
    print(error)
    return ""
  }
}()

// for each cd, push directory onto stack
// and also push into a global map between directory and size?
// for each file in each directory,
//  sum total file size onto top of stack, 
//  then propogate that summation to each member of the stack
// on each ..
//  pop member from stack

var directorySizes: [String: Int] = [:]
var stack = [String]()

for line in input.split(separator: "\n") {
  if (line.starts(with: "$")) {
    if (line.starts(with: "$ cd ..")) {
      stack.popLast()
    } else if (line.starts(with: "$ cd")) {
      let directory = line.components(separatedBy: "$ cd ")[1]
      // directory names are non unique, this dedupes them as the stack order
      // guarantees uniqueness
      let joined = "\(stack.joined(separator: "-"))\(directory)"
      stack.append(joined)
    }
  } else {
    // is not directory
    if (line.starts(with: "dir") != true) {
      let fileSize = Int(line.split(separator: " ")[0]) ?? 0
      for directory in stack {
        directorySizes[directory] = directorySizes[directory] ?? 0
        directorySizes[directory]! += fileSize
      }
    } 
  }
}

let sortedValues = directorySizes.values.sorted()
let sortedKeys = directorySizes.keys.sorted();
let amountToFree = (30000000 - (70000000 - sortedValues.last!))
var sum = 0;
var name = ""
var cont = sortedValues.last!;

for key in sortedKeys {
  let size = directorySizes[key]!
  
  if (size <= 100000) {
    sum += size
  }
  
  // find smallest value closest to target (amountToFree)
  if ((size >= amountToFree) && (size - amountToFree) <= (cont - amountToFree)) {
    name = key
    cont = size
  }
}

print(name, cont)
