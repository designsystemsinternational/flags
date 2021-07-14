# Flags

A small package with no dependencies containing up-to-date (as of 07-20201) flags and flag colors for all countries.

To produce this list we took the list in [world-countries](https://www.npmjs.com/package/world-countries)), searched for the countries with a flag in Wikipedia, and used the SVG to manually pick the colors for each.

## Usage

````
npm install @designsystemsinternational/flags
```

```js
import flags from '@designsystemsinternational/flags';

const chile = flags.find(f=>f.name == "Chile");

console.log(chile);


/* output
{
  "name": "Chile",
  "code": "CL",
  "flag": "flag/Chile.svg",
  "colors": ["#fff", "#d72b1f", "#0039a6"]
}
*/

// with webpack and the appropriate loader this would return the svg
const flag = require(`@designsystemsinternational/flags/${chile.flag}`)

```
````
