/* 
* This script deploy ALL libraries and contracts
*/

const main = async () => {

  // libraries
  const base64LibFactory = await hre.ethers.getContractFactory('Base64');
  const base64Lib = await base64LibFactory.deploy();
  await base64Lib.deployed();
  console.log("Library Base64 deployed to:", base64Lib.address);

  const castLibFactory = await hre.ethers.getContractFactory('Cast');
  const castLib = await castLibFactory.deploy();
  await castLib.deployed();
  console.log("Library Cast deployed to:", castLib.address);

  // smartcontracts
  const tickeDFactoryFactory = await hre.ethers.getContractFactory('tickeDFactory', {
    libraries: {
      Base64: base64Lib.address,
      Cast: castLib.address,
    }
  });
  const tickeDFactory = await tickeDFactoryFactory.deploy();
  await tickeDFactory.deployed();
  console.log("Contract tickeDFactory deployed to:", tickeDFactory.address);

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