import { ethers } from "hardhat";
import OsmoticController from "../abis/OsmoticController.json";
import * as dotenv from "dotenv";
dotenv.config();

const OSMOTIC_CONTROLLER_ADDRESS = "0x0b9f52138050881C4d061e6A92f72d8851B59F8e"; //proxy
const PROJECT_REGISTRY_ADDRESS = "0xFb5Ff528E295a39b1ba0b053FF7cA410396932c0"; //proxy
const OSMOTIC_POOL_ABI = [
  "function initialize(address,address,address,tuple(uint256,uint256,uint256,uint256))",
];
const FUNDING_TOKEN = "0x5CfAdf589a694723F9Ed167D647582B3Db3b33b3";
const MIME_TOKEN_ADDRESS = "0x08D6b1260EaCBB8dde0363a379f145D9f8a26Ea9";
// 0xacAA5Dd007570B8ACC6e4898e7457aD11Cbe2373 pool address 10k fakeDai

async function main() {
  const [signer] = await ethers.getSigners();

  const controller = await ethers.getContractAt(
    OsmoticController,
    OSMOTIC_CONTROLLER_ADDRESS,
    signer
  );

  const block = await ethers.provider.getBlockNumber();

  //create osmotic pool => POOL ALREADY CREATED ON GOERLI - pool 1
  const openList = PROJECT_REGISTRY_ADDRESS;

  const poolInitCode = new ethers.utils.Interface(
    OSMOTIC_POOL_ABI
  ).encodeFunctionData("initialize", [
    FUNDING_TOKEN,
    MIME_TOKEN_ADDRESS,
    openList,
    [
      "999999197747000000", // 10 days (864000 seconds) to reach 50% of targetRate
      1,
      19290123456, // 5% of Common Pool per month = Math.floor(0.05e18 / (30 * 24 * 60 * 60))
      "28000000000000000", // 2.5% of Total Support = the minimum stake to start receiving funds
    ],
  ]);

  const tx = await controller.createOsmoticPool(poolInitCode);

  const { events: createOsmoticPoolEvents } = await tx.wait();
  const { pool } = createOsmoticPoolEvents.find(
    ({ event }: { event: string }) => event === "OsmoticPoolCreated"
  ).args;

  console.log("OsmoticPool", pool);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
