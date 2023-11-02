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

// Obtaining the Proof
for (const [_, v] of tree.entries()) {
  console.log("proof:", tree.leafHash(v));
  console.log("value:", v);
  // console.log(`proof ${v}:`, tree.getProof(v));
}

// function getProofHashes() {
//   const proof0 = tree.getProof(0);
//   const proof1 = tree.getProof(1);
//   const proof2 = tree.getProof(2);
//   const proof3 = tree.getProof(3);

//   return { proof0, proof1, proof2, proof3 };
// }

// console.log("proof hashes:", getProofHashes());

// const verify = leafs.map((leaf, i) => {
//   console.log(tree.verify(leaf.split(","), tree.getProof(i)));
// });

// multiproof for the values at indices i0, i1, .... Indices refer to the position of the values in the array from which the tree was constructed.
// const {
//   proof: proofMultiProof,
//   proofFlags,
//   leaves,
// } = tree.getMultiProof([0, 1, 2, 3]);
// console.log(
//   "proof:",
//   proofMultiProof.map((p) => p.toString()),
//   "proofFlags:",
//   proofFlags,
//   "leaves:",
//   leaves
// );
