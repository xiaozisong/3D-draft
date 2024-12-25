import fs, { writeFileSync } from "fs";
import { resolve, dirname } from "path";

import { fileURLToPath } from "url";

const currentPath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentPath);

const iconDirs = ["icon/ant-icon-filled", "icon/ant-icon-outlined"];

const genNameByDir = async (dirName) => {
  const iconNames = [];
  const dir = resolve(currentDir, `../public/${dirName}`);
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === "0.name.json") {
      continue;
    }
    iconNames.push(file.replace(".svg", ""));
  }
  const content = JSON.stringify(iconNames);
  fs.writeFileSync(dir + "/0.name.json", content);
};

const main = async () => {
  for (const dirName of iconDirs) {
    await genNameByDir(dirname);
  }
};

main();