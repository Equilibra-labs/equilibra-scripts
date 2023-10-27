import { ethers } from "hardhat";
import OsmoticController from "../abis/OsmoticController.json";
import * as dotenv from "dotenv";
dotenv.config();

const OSMOTIC_CONTROLLER_ADDRESS = "0x0b9f52138050881C4d061e6A92f72d8851B59F8e";
const MIME_TOKEN_ABI = [
  "function initialize(string,string,bytes32,uint256,uint256)",
];

const MIME_TOKENS_DATA = [
  {
    name: "MimeType1",
    symbol: "T1",
    merkleRoot:
      "0xabc6ae05a1964693eb12109b0fcf3692226cb09f1fbe874f79dadf2f9193c70a",
    //hash: 0x94f02002fe04a6db0292461a3b2e38e792d91c6afaf83a91d816c4918b12cd9f
    //address-goerli:0x905dacea2b6eF8F0D482E603A5830d6dCe58d2E7
  },
  {
    name: "MimeType2",
    symbol: "T2",
    merkleRoot:
      "0xa9fdcb9e3f90b98697fc60ac88d738f445cd4843928914e8b7a8e611c7de516f",
    // hash: 0x5d979415a25711a45c56c1ef609de1f62b8e395fce8e74ac64b6ade2f83f0edd
    //address-goerli:0x002f539B66B1048f4069593Fe9bdE134fac456E8
  },
  {
    name: "MimeType3",
    symbol: "T3",
    merkleRoot:
      "0xfec4d831916cb79d198988bfb2a6fd4be49c469e593a2e4a91cc3bcb5697fb46",
    //hash: 0xe813871f850da49cf52548318cdda11cb696d6cf9cd3c69d15beae47673dc3e7
    //address-goerli:0xc367cC2921a72fABa795B90ebbAf589aeF7483dA
  },
];

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
  const index = 2;
  const mimeInitCode = new ethers.utils.Interface(
    MIME_TOKEN_ABI
  ).encodeFunctionData("initialize", [
    MIME_TOKENS_DATA[index].name,
    MIME_TOKENS_DATA[index].symbol,
    MIME_TOKENS_DATA[index].merkleRoot,
    timestamp,
    duration,
  ]);

  const tx = await controller.createMimeToken(mimeInitCode);
  const { events: createMimeTokenEvents } = await tx.wait();
  const { token: mimeToken } = createMimeTokenEvents.find(
    ({ event }: { event: string }) => event === "MimeTokenCreated"
  ).args;

  console.log(
    "block:",
    tx.block,
    "hash:",
    tx.hash,
    `MimeToken-address ${index}:`,
    mimeToken
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
