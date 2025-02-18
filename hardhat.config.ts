import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    monad: {
      url: "https://testnet-rpc2.monad.xyz/52227f026fa8fac9e2014c58fbf5643369b3bfc6",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 10053,
      gasPrice: 52500000000 // 52.5 gwei
    }
  }
};

export default config;