var { resolve } = require("path");
var fs = require('fs-extra');

const filePath = (pathName) => {
  if (pathName) {
    return resolve(__dirname, '..', pathName);
  }

  return resolve(__dirname, '..');
}

var main = async () => {
  fs.copySync(filePath('./scripts/templates/plugin-ui'), filePath(`./pls/${process.argv[2]}/ui`));
}

main();