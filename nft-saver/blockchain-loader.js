const { execFile } = require('child_process');
const fs = require("fs");
const path = require("path");


async function init() {

  const file = await fs.promises.readFile("./nft.json")
  const arr = JSON.parse(file)

  for (let file of arr) {
    const ext = path.extname(file.image_url) || ".png"
    if (ext === ".svg") continue

    if (!fs.existsSync(`./images/${file.id}${ext}`)) {
      console.log(`Image ${file.id}${ext} not found`)
      continue
    }

    const obj = { id: file.id.toString(), imgSrc: `${file.id}${ext}` }

    const nearProcess = execFile("C:/Users/fox/AppData/Local/Yarn/bin/near.cmd",
      [ "call", "dev-1645975005400-20414681997527", "create", `'${JSON.stringify(obj)}'`, "--accountId", "den59k.testnet" ],
      (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        console.log(stdout)
      }
    )

    await new Promise(res => nearProcess.once("exit", res))
  }
}

init()