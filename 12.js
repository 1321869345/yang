const fs = require("fs");
const path = require("path");
const https = require("https");

const content = `const SKINS = ###REPLACE_ME###;

const getSkinName = (id) => {
  return SKINS[id] || id;
};

module.exports = { getSkinName };
`;

const get_skin_list_json = () => {
  return new Promise((res) => {
    https.get(
      "https://cat-match-static.easygame2021.com/datas/gd_skin_list.json",
      (resp) => {
        let data = "";

        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          res(JSON.parse(data));
        });
      }
    );
  });
};

const main = async () => {
  const skins_list = await get_skin_list_json();
  const mapped = ["", ...skins_list.map((skin) => skin.name)];

  const result = content.replace("###REPLACE_ME###", JSON.stringify(mapped));
  fs.writeFileSync(path.join(__dirname, "skins.js"), result);
};

main();
