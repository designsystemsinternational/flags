# Flags

A small package with no dependencies containing up-to-date svg flags and flag colors for all countries as defined by [ISO Standard 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) that have a flag in Wikimedia Commons.

To produce this list, we iterated through [world-countries](https://www.npmjs.com/package/world-countries) to find their respective flags in Wikimedia Commons, and used the SVG file to manually pick the colors for each ordered by visual relevance (a fuzzy criteria to make the color order representative of the flag).

> **Warning:** not all entities in this project are independent countries; refer to the independent property to know if the country is considered a sovereign state.

These countries are excluded as they don't have a flag available in Wikimedia Commons.

```
[
  "Saint Helena, Ascension and Tristan da Cunha",
  "Bouvet Island",
  "Heard Island and McDonald Islands",
  "Saint Martin",
  "Svalbard and Jan Mayen",
  "United States Minor Outlying Islands",
]
```

## Usage

```
npm install @designsystemsinternational/flags
```

```js
import flags from "@designsystemsinternational/flags";

const chile = flags["Chile"];

console.log(chile);

/* output
{
  "name": "Chile",
  "code": "CL",
  "flag": "flag/Chile.svg",
  "colors": ["#fff", "#d72b1f", "#0039a6"]
}
*/

// this would return the svg
// with webpack and an svg loader
// or an equivalent setup
const flag = require(`@designsystemsinternational/flags/${chile.flag}`);

// iterate through all flags
for (flag in flags) {
    console.log(flags[flag]);
}

```
