const axios = require("axios").default;
const fs = require("fs")
const uniqBy = require('lodash.uniqby');

const LIMIT_PER_REQUEST = 50;

const init = async (assetsLimit) => {
  const requetsCount = Math.ceil(assetsLimit / LIMIT_PER_REQUEST); 
  const requests = new Array(requetsCount).fill(0).map((_,i)=>{
    const assetsCount = requetsCount - 1 === i ? assetsLimit - i * LIMIT_PER_REQUEST : LIMIT_PER_REQUEST;
    return axios.get(`https://testnets-api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=${assetsCount}`)
  })
  const response = await Promise.all(requests);
  const assets = uniqBy(response.map(r=>r.data.assets).flat(), 'image_url').map(as=>({url: as.image_url, owner: as.owner.address}));
  

  await fs.promises.writeFile("./nft.json", JSON.stringify(assets))
  console.log(`nft.json writed! Images count: ${assets.length}`)

  // const file = await fs.promises.readFile("./nft.json")
  // const arr = JSON.parse(file)

  // for (let file of arr) {
  //   const resp = await axios.get(file.image_url, {
  //     responseType: "arraybuffer"
  //   })
  //   await fs.promises.writeFile(`./images/${file.id}.png`, resp.data)
  //   console.log(`Image ${file.id}.png downloaded. (${resp.data.length} bytes)`)
  // }

}

init(50)