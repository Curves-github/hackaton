const axios = require("axios").default;
const fs = require("fs");
const path = require("path");

const init = async () => {

  // const assets = JSON.parse(await fs.promises.readFile("./assets.json"))
  const assets = []

  for (let i = 0; i < 50; i++) {
    try {
      const resp = await axios.get(`https://testnets-api.opensea.io/api/v1/assets?order_direction=desc&offset=${i*50}&limit=50`)
      assets.push(...resp.data.assets)
      console.log(`Assets ${i*50} - ${(i+1)*50-1} downloaded`)

      await fs.promises.writeFile("./assets.json", JSON.stringify(assets))
    } catch(e) {
      break;
    }
  }

  const images = new Set()
  const arr = []
  for (let asset of assets) {
    if (!asset.image_url) continue
    if (images.has(asset.image_url)) continue
    images.add(asset.image_url)
    arr.push(asset)
  }

  await fs.promises.writeFile("./nft.json", JSON.stringify(arr))
  console.log(`nft.json writed! Images count: ${arr.length}`)

  // const file = await fs.promises.readFile("./nft.json")
  // const arr = JSON.parse(file)

  for (let file of arr) {
    const ext = path.extname(file.image_url) || ".png"
    try {
      if (fs.existsSync(`./images/${file.id}${ext}`)) {
        console.log(`Image ${file.id}${ext} passed`)
        continue
      }

      const resp = await axios.get(file.image_url, {
        responseType: "arraybuffer"
      })

      await fs.promises.writeFile(`./images/${file.id}${ext}`, resp.data)
      console.log(`Image ${file.id}${ext} downloaded. (${resp.data.length} bytes)`)
    }catch(e){
      console.log(`Image ${file.id}${ext} NOT downloaded.`)
    }
  }

}

init()