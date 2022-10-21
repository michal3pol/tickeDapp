const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('tickeD');
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();
    console.log("Contract deployed to:", nftContract.address);
    
    // run contract
    let txn = await nftContract.createNFT();
    await txn.wait();

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