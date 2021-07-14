const path = require("path");
const fs = require("fs");
const { parseStringPromise } = require("xml2js");
const axios = require("axios");

const createDirSync = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
      mode: 0o755,
    });
  }
};

const getFlagUrlFromWikimedia = async (name, nameOfficial) => {
  let data;
  try {
    const res = await axios.get(
      `https://magnus-toolserver.toolforge.org/commonsapi.php?image=Flag_of_${name}.svg`
    );
    data = await parseStringPromise(res.data);
  } catch (e) {
    console.error(e);
  }
  const url = data?.response.file?.[0].urls[0].file[0];
  if (!url) {
    if (nameOfficial) {
      return getFlagUrlFromWikimedia(nameOfficial);
    }
  }
  return url;
};

const downloadFile = async (fileUrl, outputLocationPath, name) => {
  const writer = fs.createWriteStream(outputLocationPath);
  let response;

  try {
    response = await axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
    });
  } catch (e) {
    console.error(e);
  }

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    let error = null;
    writer.on("error", (err) => {
      error = err;
      writer.close();
      reject(err);
    });
    writer.on("close", () => {
      if (!error) {
        resolve(true);
      }
    });
  });
};

module.exports = {
  createDirSync,
  downloadFile,
  getFlagUrlFromWikimedia,
};
