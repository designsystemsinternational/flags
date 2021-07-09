const fs = require("fs");
const { parseStringPromise } = require("xml2js");
const axios = require("axios");

const getFlagUrlFromWikimedia = async (name) => {
  console.log(`> Getting flag url from Wikimedia...`);

  try {
    const res = await axios.get(
      `https://magnus-toolserver.toolforge.org/commonsapi.php?image=Flag_of_${name}.svg`
    );
    const data = await parseStringPromise(res.data);
    const url = data.response.file[0].urls[0].file[0];
    if (!url) console.log(data.response);
    return url;
  } catch (e) {
    console.log(e);
  }
};

const downloadFile = async (fileUrl, outputLocationPath, name) => {
  console.log(`> Downloading flag...`);
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
        console.log(`> Done.`);
        resolve(true);
      }
    });
  });
};

module.exports = {
  downloadFile,
  getFlagUrlFromWikimedia,
};
