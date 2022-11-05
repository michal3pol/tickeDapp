const main = async () => {
    const nftLibFactory = await hre.ethers.getContractFactory('Base64');

    const nftLib = await nftLibFactory.deploy();
    await nftLib.deployed();
    console.log("Library Base64 deployed to:", nftLib.address);

    const nftLibFactory1 = await hre.ethers.getContractFactory('Cast');

    const nftLib1 = await nftLibFactory1.deploy();
    await nftLib1.deployed();
    console.log("Library Cast deployed to:", nftLib1.address);

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