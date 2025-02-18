// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    monad: {
      url: "https://testnet-rpc2.monad.xyz/52227f026fa8fac9e2014c58fbf5643369b3bfc6",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 10143,  // Updated from 10053 to 10143
      gasPrice: 52500000000 // 52.5 gwei
    }
  }
};