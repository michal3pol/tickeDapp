const main = async () => {

    const nftMarketplaceFactory = await hre.ethers.getContractFactory('nftMarketplace');
    const nftMFD = await nftMarketplaceFactory.deploy();
    await nftMFD.deployed();
    console.log("Contract nfMarketplace deployed to:", nftMFD.address);

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