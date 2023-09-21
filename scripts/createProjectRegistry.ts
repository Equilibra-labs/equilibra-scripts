import { ethers } from "hardhat";
import ProjectRegistryABI from "../abis/ProjectRegistry.json";
import * as dotenv from "dotenv";
dotenv.config();

const PROJECT_REGISTRY_ADDRESS = "0xFb5Ff528E295a39b1ba0b053FF7cA410396932c0"; //proxy contract
const BENEFICIARY = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

async function main() {
  const [signer] = await ethers.getSigners();

  //create ProjectRegistry

  const projectRegistry = await ethers.getContractAt(
    ProjectRegistryABI,
    PROJECT_REGISTRY_ADDRESS,
    signer
  );

  const encodeData = ethers.utils.defaultAbiCoder.encode(
    ["string", "string"],
    ["Description", "Link to github"]
  );
  //playground for encode and decode

  // const decode = ethers.utils.defaultAbiCoder.decode(
  //   ["string", "string"],
  //   encodeData
  // );
  //console.log(decode);

  const tx = await projectRegistry.registerProject(BENEFICIARY, encodeData);
  await tx.wait();
  console.log("Transaction hash:", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
