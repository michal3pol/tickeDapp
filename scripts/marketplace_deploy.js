/* 
* This script deploy ONLY marketplace contract
*/

const main = async () => {

  const nftMarketplaceFactory = await hre.ethers.getContractFactory('nftMarketplace');
  const nftMarketplace = await nftMarketplaceFactory.deploy();
  await nftMarketplace.deployed();
  console.log("Contract nfMarketplace deployed to:", nftMarketplace.address);

  };

  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();