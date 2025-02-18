// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
  
    const LingobabeTokenV2 = await ethers.getContractFactory("LingobabeTokenV2");
    console.log("Deploying LingobabeTokenV2...");
    const token = await LingobabeTokenV2.deploy();
    
    // For ethers v6, wait for the deployment transaction
    await token.deploymentTransaction().wait();
    
    // Get the deployed contract address
    const tokenAddress = await token.getAddress();
    console.log("LingobabeTokenV2 deployed to:", tokenAddress);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });