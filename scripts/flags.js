const path = require("path");
const fs = require("fs");
const countries = require("world-countries");
const ora = require("ora");

const {
  createDirSync,
  getFlagUrlFromWikimedia,
  downloadFile,
} = require("./utils");

const OUTPUT_DIR = path.resolve(__dirname, "../bin");
const JSON_PATH = path.resolve(OUTPUT_DIR, "countries-with-flag.json");

// these must be consistent with npm run svg:optimize
const RAW_FLAG_DIR = path.resolve(OUTPUT_DIR, "flag-raw/");
const FLAG_DIR = path.resolve(OUTPUT_DIR, "../flag/");

// these countries don't have a flag
const ignore = [
  "Saint Helena, Ascension and Tristan da Cunha",
  "Bouvet Island",
  "Heard Island and McDonald Islands",
  "Saint Martin",
  "Svalbard and Jan Mayen",
  "United States Minor Outlying Islands",
];

const getAllFlags = async () => {
  const errors = [];
  const output = [];

  createDirSync(OUTPUT_DIR);
  createDirSync(RAW_FLAG_DIR);
  createDirSync(FLAG_DIR);

  const generalProgress = ora("Getting flags for world-countries").start();

  for (var i = 0; i < countries.length; i++) {
    const country = countries[i];
    const name = country.name.common;
    const nameOfficial = country.name.official;

    if (ignore.includes(name)) {
      continue;
    }
    const dest = path.resolve(RAW_FLAG_DIR, `${name}.svg`);
    const progress = ora(name).start();
    if (!fs.existsSync(dest)) {
      progress.text = "Getting flag URL from Wikimedia";
      const url = await getFlagUrlFromWikimedia(name, nameOfficial);
      if (!url) {
        progress.fail(`${name}, URL not found`);
        errors.push(`${name}, URL not found`);
        continue;
      } else {
        try {
          progress.text = "Downloading flag";
          await downloadFile(url, dest, name);
        } catch (e) {
          progress.fail(`${name}, error downloading`);
          errors.push(`${name}, error downloading`);
          continue;
        }
      }
    }
    output.push({
      name,
      independent: country.independent,
      code: country.cca2,
      flag: `flag/${name}.svg`,
    });
    progress.succeed(`${name} done.`);
  }
  generalProgress.text = "Writing data to countries-with-flag.json";
  fs.writeFileSync(JSON_PATH, JSON.stringify(output));
  generalProgress.succeed("Done");
  console.log("flags with errors:", errors);
};

getAllFlags();
