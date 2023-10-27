import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

//Building a Tree
const [encoding, ...leafs] = fs
  .readFileSync("values.csv", "utf-8")
  .trim()
  .split("\n");

const tree = StandardMerkleTree.of(
  leafs.map((leaf) => leaf.split(",")),
  encoding.split(",")
);
console.log("Merkle Root Done:", tree.root);

fs.writeFileSync("tree.json", JSON.stringify(tree.dump(), null, 2));

//Obtaining the Proof
// (1) Get the index of the value you want to obtain the proof for
const index = 1;

// (2) Get the proof for the given index
const proof = tree.getProof(index);

console.log("Proof for index", index, ":", proof);
