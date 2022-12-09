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

// // for each cd, push directory onto stack
// and also push into a map? using the stack as the pointer? to get back to to parent
// // for each file in directory, sum total file size onto top of stack, and then propogate that summation higher

var directorySizes: [String: Int] = [:]
var stack = [String]()

for line in input.split(separator: "\n") {
  if (line.starts(with: "$")) {
    if (line.starts(with: "$ cd ..")) {
      // print("Going back removing from stack \(stack)")
      stack.popLast()
    } else if (line.starts(with: "$ cd")) {
      let directory = line.components(separatedBy: "$ cd ")[1]
      // print("Changing directory, appending to stack = \(directory)")
      stack.append(directory)
    }
  } else {
    // is not directory
    if (line.starts(with: "dir") != true) {
      let fileSize = line.split(separator: " ")[0]

      // print("Stack: \(stack)")
      // print("Sizes (pre addition): \(directorySizes)")
      for directory in stack {
        directorySizes[directory] = directorySizes[directory] ?? 0
        print("DIR SIZE for \(directory) =  \(directorySizes[directory])")
        directorySizes[directory]! += Int(fileSize) ?? 0
        print("DIR SIZE AFTER ADDING for \(directory) = \(directorySizes[directory])")
      }
      // print("Sizes (post addition): \(directorySizes)")
    } 
  }
}

// print(directorySizes)

var sum = 0;

for (dir, size) in directorySizes {
  if (size <= 100000) {
    sum += size
  }
}

// 932016 -> too low.
// 932017 -> too low.
print(sum)