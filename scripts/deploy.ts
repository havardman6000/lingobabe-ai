import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const LingobabeTokenV2 = await ethers.getContractFactory("LingobabeTokenV2");
  
  // Deploy the contract
  console.log("Deploying LingobabeTokenV2...");
  const token = await LingobabeTokenV2.deploy();
  
  // Wait for deployment to finish
  await token.deployed();
  
  console.log("LingobabeTokenV2 deployed to:", token.address);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });