import { ethers } from "hardhat";
import OsmoticController from "../abis/OsmoticController.json";
import * as dotenv from "dotenv";
dotenv.config();

const OSMOTIC_CONTROLLER_ADDRESS = "0x0b9f52138050881C4d061e6A92f72d8851B59F8e";
const PROJECT_REGISTRY_ADDRESS = "0xFb5Ff528E295a39b1ba0b053FF7cA410396932c0";
const OSMOTIC_POOL_ABI = [
  "function initialize(address,address,address,tuple(uint256,uint256,uint256,uint256))",
];
const MIME_TOKEN_ABI = [
  "function initialize(string,string,bytes32,uint256,uint256)",
];
const MERKLE_ROOT =
  "0x842b347c47bab241c22f360332637f743904f6fc7fc66e688c58662be47517a7";
const FUNDING_TOKEN = "0x5CfAdf589a694723F9Ed167D647582B3Db3b33b3";

async function main() {
  const [signer] = await ethers.getSigners();

  const controller = await ethers.getContractAt(
    OsmoticController,
    OSMOTIC_CONTROLLER_ADDRESS,
    signer
  );

  const timestamp = await controller.claimTimestamp();
  const duration = await controller.claimDuration();

  // create mime token
  const mimeInitCode = new ethers.utils.Interface(
    MIME_TOKEN_ABI
  ).encodeFunctionData("initialize", [
    "Osmotic Fund",
    "OF",
    MERKLE_ROOT,
    timestamp,
    duration,
  ]);

  const tx = await controller.createMimeToken(mimeInitCode);
  const { events: createMimeTokenEvents } = await tx.wait();
  const { token: mimeToken } = createMimeTokenEvents.find(
    ({ event }: { event: string }) => event === "MimeTokenCreated"
  ).args;

  console.log("MimeToken", mimeToken);

  // // create osmotic pool
  // const openList = PROJECT_REGISTRY_ADDRESS;

  // const poolInitCode = new ethers.utils.Interface(
  //   OSMOTIC_POOL_ABI
  // ).encodeFunctionData("initialize", [
  //   FUNDING_TOKEN,
  //   mimeToken,
  //   openList,
  //   [
  //     '999999197747000000', // 10 days (864000 seconds) to reach 50% of targetRate
  //     2,
  //     19290123456, // 5% of Common Pool per month = Math.floor(0.05e18 / (30 * 24 * 60 * 60))
  //     '25000000000000000', // 2.5% of Total Support = the minimum stake to start receiving funds
  //   ],
  // ]);

  // const tx2 = await controller.createOsmoticPool(poolInitCode);
  // const { events: createOsmoticPoolEvents } = await tx2.wait();
  // const { pool } = createOsmoticPoolEvents.find(
  //   ({ event }: { event: string }) => event === "OsmoticPoolCreated"
  // ).args;

  //console.log("OsmoticPool", pool);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
