import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

//Building a Tree
// (1)
const values = [
  ["0x1111111111111111111111111111111111111111", "5000000000000000000"],
  ["0x2222222222222222222222222222222222222222", "2500000000000000000"],
];
// (2)
const tree = StandardMerkleTree.of(values, ["address", "uint256"]);
// (3)
console.log("Merkle Root Done:", tree.root);

//Obtaining the Proof
// (1) Get the index of the value you want to obtain the proof for
const index = 1;

// (2) Get the proof for the value at the specified index
const proof = tree.getProof(index);

// (3) Serialize the proof to a string
const proofString = JSON.stringify(proof);
console.log("Proof:", proofString);
console.log("verify ?", tree.verify(values[index], proof));

//Lists the values in the tree along with their indices, which can be used to obtain proofs.
// for (const [i, v] of tree.entries()) {
//   console.log("value:", v);
//   console.log("proof:", tree.getProof(i));
// }

//console.log(tree.render());

//Returns the leaf hash of the value
for (const [i, v] of tree.entries()) {
  console.log("value:", v);
  console.log("proof:", tree.leafHash(v));
}
