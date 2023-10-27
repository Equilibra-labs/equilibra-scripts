import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

//Building a Tree
// (1)
const values = [
  ["0x5BE8Bb8d7923879c3DDc9c551C5Aa85Ad0Fa4dE3", "5000000000000000000"],
  ["0x2cc10a00c6906910601680B9186751f2aFBB4B49", "2500000000000000000"],
  ["0xa25211B64D041F690C0c818183E32f28ba9647Dd", "3500000000000000000"],
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
for (const [, v] of tree.entries()) {
  console.log("value:", v);
  console.log("proof:", tree.leafHash(v));
}
