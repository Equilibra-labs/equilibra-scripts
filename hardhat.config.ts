import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: process.env.GOERLI_RPC_URL || "",
      },
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts:{
        mnemonic: process.env.PRIVATE_KEY,
      }
    }
  },
};

export default config;
