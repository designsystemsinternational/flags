// very simple test. if it doesn't throw, it works!

const flags = require(".");
let test = {};
for (flag in flags) {
  test[flag] = {
    firstColor: flags[flag].colors[0],
    name: flags[flag].name,
  };
}
const chile = flags["Chile"];
console.log(chile);
test["Chile"].firstColor = chile.colors[0];
test["Chile"].name = chile.name;
if (flags["Chile"].name !== test["Chile"].name) {
  throw new Error("something's wrong");
}
// if it doesn't crash it works!
console.log("works!");
