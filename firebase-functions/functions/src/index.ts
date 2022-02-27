import * as functions from 'firebase-functions';
import { connect, keyStores, utils} from 'near-api-js'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
export const helloWorld = functions
  .runWith({ secrets: ["NEAR_UPLOADER_CREDENTIALS"] })
  .https.onRequest((_, response) => {
    // ${process.env.NEAR_UPLOADER_CREDENTIALS}
    response.send(`Hello from Firebase!`);
  });

export const scheduledInsertUnits = functions
  .runWith({ secrets: ["NEAR_UPLOADER_CREDENTIALS"] })
  // .pubsub.schedule('0 4 * * *')
  .pubsub.schedule('every 5 minutes')
  .timeZone('Europe/Moscow') 
  .onRun((context) => {
    const privateKey = process.env.NEAR_UPLOADER_CREDENTIALS;
    const accountId = process.env.NEAR_UPLOADER_ACCOUNT;
    if(!privateKey || !accountId){
      throw new Error(`private key(${privateKey}) or account id(${accountId}) not found`)
    }
    const keyPair = utils.KeyPair.fromString(privateKey);
    const keyStore = new keyStores.InMemoryKeyStore();
    keyStore.setKey('testnet', accountId, keyPair);
    const config = { 
      keyStore, 
      networkId: 'testnet',
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org',
      headers: {}
    };
    (async function () {
      const near = await connect(config);
      const account = await near.account(accountId);
      const state = await account.state()
      console.log({state})
    })();
  
  return null;
});
