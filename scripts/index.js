const path = require("path");
const fs = require("fs");
const { getFlagUrlFromWikimedia, downloadFile } = require("./utils");
const flags = require("../flags");
const errors = [];

const getAllFlags = async () => {
  for (var i = 0; i < flags.length; i++) {
    const flag = flags[i];
    const dest = path.resolve(__dirname, `../flag/${flag.name}.svg`);

    console.log(`----\n> ${flag.name}`);

    if (fs.existsSync(dest)) {
      console.log(`> File exists. Skipping...`);
      continue;
    }
    try {
      const url = await getFlagUrlFromWikimedia(flag.name);

      if (url) {
        await downloadFile(url, dest, flag.name);
      } else {
        console.log(`> URL not found.`);
        errors.push(flag.name);
      }
    } catch (e) {
      console.log(`error downloading ${flag.name}`);
      errors.push(flag.name);
    }
  }
  console.log("flags with errors:", errors);
};

getAllFlags();
