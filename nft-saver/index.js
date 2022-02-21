const axios = require("axios").default;
const fs = require("fs")

const init = async () => {

  const resp = await axios.get("https://testnets-api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=50")
  const resp2 = await axios.get("https://testnets-api.opensea.io/api/v1/assets?order_direction=desc&offset=50&limit=50")
  const resp3 = await axios.get("https://testnets-api.opensea.io/api/v1/assets?order_direction=desc&offset=100&limit=50")

  const assets = [ ...resp.data.assets, resp2.data.assets, resp3.data.assets ]

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
    const resp = await axios.get(file.image_url, {
      responseType: "arraybuffer"
    })
    await fs.promises.writeFile(`./images/${file.id}.png`, resp.data)
    console.log(`Image ${file.id}.png downloaded. (${resp.data.length} bytes)`)
  }

}

init()