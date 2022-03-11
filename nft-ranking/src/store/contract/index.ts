import { action, makeObservable, observable } from 'mobx';
import { connect, keyStores, WalletConnection, Contract } from 'near-api-js';
import getConfig from '../../utils/contract-config';

class ContractStore {

  walletConnection!: WalletConnection
  contract!: any
  currentUser: { accountId: string, balance: string } | null = null
  nearConfig = getConfig(process.env.NODE_ENV || 'testnet');

  constructor() {
    makeObservable(this, {
      currentUser: observable,
      setCurrentUser: action
    })
  }

  async initContract() {
  
    // Initializing connection to the NEAR TestNet
    const near = await connect({
      deps: {
        keyStore: new keyStores.BrowserLocalStorageKeyStore()
      },
      headers: {},
      ...this.nearConfig
    });
  
    // Needed to access wallet
    this.walletConnection = new WalletConnection(near, null);
  
    // Load in account data
    if(this.walletConnection.getAccountId()) {
      const balance = (await this.walletConnection.account().state()).amount
      this.setCurrentUser({ accountId: this.walletConnection.getAccountId(), balance} )
    }
  
    // Initializing our contract APIs by contract name and configuration
    this.contract = new Contract(this.walletConnection.account(), this.nearConfig.contractName, {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: ["getAll", "getTwoCards", "getWinners" ],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: ["vote" ]
    });
  }

  signIn() {
    this.walletConnection.requestSignIn(
      this.nearConfig.contractName,
      'NEAR ToDo List'
    );
  };

  signOut() {
    this.walletConnection.signOut();
    this.setCurrentUser(null)
    window.location.replace(window.location.origin + window.location.pathname);
  };

  setCurrentUser(user: typeof this.currentUser) {
    this.currentUser = user
  }

}

export default ContractStore