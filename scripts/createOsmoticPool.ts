import { ethers } from "hardhat";
import OsmoticController from "../abis/OsmoticController.json";
import * as dotenv from "dotenv";
dotenv.config();

const OSMOTIC_CONTROLLER_ADDRESS = "0x0b9f52138050881C4d061e6A92f72d8851B59F8e"; //proxy
const OSMOTIC_POOL_ABI = [
  "function initialize(address,address,address,tuple(uint256,uint256,uint256,uint256))",
];
const FUNDING_TOKEN = "0x5943F705aBb6834Cad767e6E4bB258Bc48D9C947"; //ETHx goerli

// 0x44877391133ED75906264dD352149a3aB2ee43F2 mimetoken address which could claim token!!!

const POOLS_DATA = [
  {
    mimeTokenAddress: "0x44877391133ED75906264dD352149a3aB2ee43F2",
    //mimeToken => FedeToken
    listAddress: "0xd486d0a08ec6f86eb71579277ab1a7ae34b1fff1",
    //liste name: ListOne
  },
  {
    mimeTokenAddress: "",
    listAddress: "",
  },
  {
    mimeTokenAddress: "0xdE2e52198E7946d823688FeA69819761e9cB38eD",
    listAddress: "0xc2d3e42f46de27245f5f9298cf5211f487599f48",
    //ListTwo
    //hash mime token 2: 0x5226727ab56180b0cd31e2dd724584482c57f14de68cdb140cdfd5595f4f049e
  },
];

async function main() {
  const [signer] = await ethers.getSigners();

  const controller = await ethers.getContractAt(
    OsmoticController,
    OSMOTIC_CONTROLLER_ADDRESS,
    signer
  );
  //create osmotic pool => POOL ALREADY CREATED ON GOERLI - pool 1

  const index = 0;
  const poolInitCode = new ethers.utils.Interface(
    OSMOTIC_POOL_ABI
  ).encodeFunctionData("initialize", [
    FUNDING_TOKEN,
    POOLS_DATA[index].mimeTokenAddress,
    POOLS_DATA[index].listAddress,
    [
      "999999197747000000", // 10 days (864000 seconds) to reach 50% of targetRate // cuanto tiempo tiene que pasar para que el flujio pool project se acumeule hasta la mitad del valor
      1,
      19290123456, // 5% of Common Pool per month = Math.floor(0.05e18 / (30 * 24 * 60 * 60))
      "28000000000000000", // 2.5% of Total Support = the minimum stake to start receiving funds,  lo minimo que un project tiene que ser soportardo para que empieze a recibir fondos, es decir, active el flujo. Del total de token u votos disponibles
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
