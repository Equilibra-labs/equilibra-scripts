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
console.log("Merkle Root:", tree.root);

fs.writeFileSync("tree.json", JSON.stringify(tree.dump(), null, 2));

//Obtaining the Proof
for (const [_, v] of tree.entries()) {
  console.log("proof:", tree.leafHash(v));
  console.log("value:", v);
}

// const verify = leafs.map((leaf, i) => {
//   console.log(tree.verify(leaf.split(","), tree.getProof(i)));
// });
// console.log(verify);

//multiproof for the values at indices i0, i1, .... Indices refer to the position of the values in the array from which the tree was constructed.
// const {
//   proof: proofMultiProof,
//   proofFlags,
//   leaves,
// } = tree.getMultiProof([0, 1, 2]);
// console.log(
//   "proof:",
//   proofMultiProof,
//   "proofFlags:",
//   proofFlags,
//   "leaves:",
//   leaves
// );
