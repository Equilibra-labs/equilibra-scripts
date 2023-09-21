import { ethers } from "hardhat";
import OsmoticController from "../abis/OsmoticController.json";
import * as dotenv from "dotenv";
dotenv.config();

const OSMOTIC_CONTROLLER_ADDRESS = "0x0b9f52138050881C4d061e6A92f72d8851B59F8e";
const MIME_TOKEN_ABI = [
  "function initialize(string,string,bytes32,uint256,uint256)",
];
const MERKLE_ROOT =
  "0x842b347c47bab241c22f360332637f743904f6fc7fc66e688c58662be47517a7";

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
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
