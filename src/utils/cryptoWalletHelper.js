const multiChainWallet = require('multichain-crypto-wallet');


const createWalletAndGetData = async (orgDetails) => {
    /* Create Wallet */
    try {
        const wallet = await multiChainWallet.createWallet({
          network: 'ethereum', 
        }); 

        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic
          }
        
      } catch (error) {
        console.error("Create Wallet Account ::", orgDetails, error);
      }

    return {
        address: '',
        privateKey: '',
        mnemonic: ''
    }
}

const getBalance = async (address) => {
  try {
    const data = await multiChainWallet.getBalance({
      address: address,
      network: 'ethereum',
      rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    })
    return data
  } catch (error) {
    console.log("error ::", address, error);
    return 0
  }
}
module.exports = {
    createWalletAndGetData,
    getBalance
}
